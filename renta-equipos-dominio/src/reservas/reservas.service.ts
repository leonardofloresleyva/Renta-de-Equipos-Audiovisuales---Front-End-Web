import { Inject, Injectable } from '@nestjs/common';
import type { ReservaRepository } from './repositorios/reserva.repository';
import { DEPOSITO_GARANTIA_REPOSITORY, RESERVA_REPOSITORY, SOLICITUD_CANCELACION_REPOSITORY } from './reservas.tokens';
import { ARTICULO_REPOSITORY } from 'src/inventario/inventario.tokens';
import type { ArticuloReservaRepository } from './repositorios/articulo.reserva.repository';
import type { DepositoGarantiaRepository } from './repositorios/deposito.garantia.repository';
import type { SolicitudCancelacionRepository } from './repositorios/solicitud.cancelacion.repository';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { InventarioService } from 'src/inventario/inventario.service';
import { ArticuloReserva, DepositoGarantia, FiltrosReserva, FiltrosSolicitud, NuevaReserva, NuevaSolicitud, NuevoArticuloReserva, nuevoFolio, porcentajeGarantia, Reserva, SolicitudCancelacion } from 'src/dominio/entidades';
import { CrearReservaDto } from './dto/crear.reserva.dto';
import { ArticuloNoEncontradoError, CancelacionReservaInvalidaError, CantidadExcesivaError, ClienteNoEncontradoError, DisponibilidadInsuficienteError, EstadoReservaInvalidoError, FechasInvalidasError, ReservaNoEncontradaError, SolicitudNoEncontradaError } from 'src/dominio/errores';
import { DisponibilidadService } from 'src/disponibilidad/disponibilidad.service';
import { CrearSolicitudDto } from './dto/crear.solicitud.dto';

@Injectable()
export class ReservasService {
    constructor(
        @Inject(RESERVA_REPOSITORY)
        private readonly reservasRepo: ReservaRepository,
        @Inject(ARTICULO_REPOSITORY)
        private readonly articulosReservaRepo: ArticuloReservaRepository,
        @Inject(DEPOSITO_GARANTIA_REPOSITORY)
        private readonly depositosRepo: DepositoGarantiaRepository,
        @Inject(SOLICITUD_CANCELACION_REPOSITORY)
        private readonly solicitudesRepo: SolicitudCancelacionRepository,
        // Servicios de soporte
        private readonly usuariosService: UsuariosService,
        private readonly inventarioService: InventarioService,
        private readonly dispoService: DisponibilidadService
    ){}

    listar(filtros?: FiltrosReserva): Promise<Reserva[]> {
        return this.reservasRepo.listar(filtros);
    }

    buscarPorId(id: number): Promise<Reserva | null> {
        return this.reservasRepo.buscarPorId(id);
    }

    buscarPorCliente(id: number): Promise<Reserva[]> {
        return this.reservasRepo.buscarPorCliente(id);
    }

    buscarArticulosPorReserva(reservaId: number): Promise<ArticuloReserva[]> {
        return this.articulosReservaRepo.buscarPorReserva(reservaId);
    }

    async crear(dto: CrearReservaDto): Promise<Reserva> {
        // Verificar a cliente asociado
        const cliente = await this.usuariosService.buscarClientePorId(dto.clienteId);
        if (!cliente) throw new ClienteNoEncontradoError(dto.clienteId);
        

        // REGLA DE NEGOCIO 02 - VERIFICAR FECHAS VÁlIDAS
        
        // Se verifica si el rango es válido (futuras y recolección después de entrega)
        if (dto.fechaEntrega < new Date() || dto.fechaRecoleccion < new Date() || dto.fechaRecoleccion <= dto.fechaEntrega) {
            throw new FechasInvalidasError()
        };

        // REGLA DE NEGOCIO 01 - VERIFICAR DISPONIBILIDAD DE ARTÍCULOS
        const articulosReservados: NuevoArticuloReserva[] = [];
        let montoTotal = 0;
        // Se verifica que las existencias sean suficientes para cada artículo reservado
        for(let a of dto.articulos) {
            const articulo = await this.inventarioService.buscarArticuloPorId(a.articuloId);
            if (!articulo) throw new ArticuloNoEncontradoError(a.articuloId);

            if (a.cantidad > articulo.existencias) throw new CantidadExcesivaError(articulo.id, a.cantidad - articulo.existencias);

            const piezasApartadasPeriodo = await this.dispoService.obtenerPiezasApartadasPeriodo(articulo.id, dto.fechaEntrega, dto.fechaRecoleccion) + a.cantidad;
            if (piezasApartadasPeriodo > articulo.existencias) throw new DisponibilidadInsuficienteError(articulo.nombre);
            const nuevoArticuloReservado = {
                articuloId: a.articuloId,
                cantidad: a.cantidad,
                precioUnitario: articulo.precioPorDia,
                subtotal: articulo.precioPorDia * a.cantidad
            };
            montoTotal += nuevoArticuloReservado.subtotal;
            articulosReservados.push(nuevoArticuloReservado);
        }
        
        // Se contruye la nueva reserva validada
        const nuevaReserva: NuevaReserva = {
            clienteId: dto.clienteId,
            folio: nuevoFolio(),
            montoTotal: montoTotal,
            fechaEntrega: dto.fechaEntrega,
            fechaRecoleccion: dto.fechaRecoleccion,
            numero: dto.numero,
            calle: dto.calle,
            colonia: dto.colonia,
            montoGarantia: montoTotal * porcentajeGarantia // REGLA DE NEGOCIO 08
        };
        return this.reservasRepo.crear(nuevaReserva, articulosReservados);
    }

    obtenerGarantiaPorReserva(reservaId: number): Promise<DepositoGarantia | null> {
        return this.depositosRepo.buscarPorReserva(reservaId);
    }

    async entregar(id: number): Promise<Reserva> {
        // Verificar la existencia de la reserva
        const reserva = await this.reservasRepo.buscarPorId(id);
        if (!reserva) throw new ReservaNoEncontradaError(id);

        // Verificar estado de la reserva
        if (reserva.estado !== 'apartada') throw new EstadoReservaInvalidoError();

        return await this.reservasRepo.entregar(id) ?? reserva; // Temporal por ser repo en memoria
    }

    async recolectar(id: number): Promise<Reserva> {
        // Verificar la existencia de la reserva
        const reserva = await this.reservasRepo.buscarPorId(id);
        if (!reserva) throw new ReservaNoEncontradaError(id);
        
        // Verificar estado de la reserva
        if (reserva.estado !== 'entregada') throw new EstadoReservaInvalidoError();

        return await this.reservasRepo.recolectar(id) ?? reserva; // Temporal por ser repo en memoria
    }

    async cancelar(id: number): Promise<Reserva> {
        // Verificar la existencia de la reserva
        const reserva = await this.reservasRepo.buscarPorId(id);
        if (!reserva) throw new ReservaNoEncontradaError(id);
        
        // Verificar estado de la reserva
        if (reserva.estado !== 'apartada') throw new EstadoReservaInvalidoError();

        // REGLA DE NEGOCIO 06
        // Verificar que los artículos de la reserva no hayan sido entregados
        if (new Date() >= reserva.fechaEntrega) throw new CancelacionReservaInvalidaError();

        return await this.reservasRepo.cancelar(id) ?? reserva; // Temporal por ser repo en memoria
    }

    async listarSolicitudes(filtros?: FiltrosSolicitud): Promise<SolicitudCancelacion[]> {
        return this.solicitudesRepo.listar(filtros);
    }

    async crearSolicitud(dto: CrearSolicitudDto): Promise<SolicitudCancelacion> {
        // Verificar la existencia de la reserva
        const reserva = await this.reservasRepo.buscarPorId(dto.reservaId);
        if (!reserva) throw new ReservaNoEncontradaError(dto.reservaId);

        // Verificar a cliente asociado
        const cliente = await this.usuariosService.buscarClientePorId(dto.clienteId);
        if (!cliente) throw new ClienteNoEncontradoError(dto.clienteId);
        const nuevaSolicitud: NuevaSolicitud = {
            clienteId: dto.clienteId,
            reservaId: dto.reservaId
        };
        return this.solicitudesRepo.crear(nuevaSolicitud);
    }

    async rechazarSolicitud(id: number): Promise<SolicitudCancelacion | null> {
        return await this.solicitudesRepo.rechazar(id); // Temporal por ser repo en memoria
    }

}
