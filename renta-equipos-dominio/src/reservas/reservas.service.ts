import { Inject, Injectable } from '@nestjs/common';
import type { ReservaRepository } from './repositorios/reserva.repository';
import { DEPOSITO_GARANTIA_REPOSITORY, RESERVA_REPOSITORY, SOLICITUD_CANCELACION_REPOSITORY } from './reservas.tokens';
import { ARTICULO_REPOSITORY } from 'src/inventario/inventario.tokens';
import type { ArticuloReservaRepository } from './repositorios/articulo.reserva.repository';
import type { DepositoGarantiaRepository } from './repositorios/deposito.garantia.repository';
import type { SolicitudCancelacionRepository } from './repositorios/solicitud.cancelacion.repository';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { InventarioService } from 'src/inventario/inventario.service';
import { ArticuloReserva, DepositoGarantia, NuevaReserva, NuevoArticuloReserva, nuevoFolio, porcentajeGarantia, Reserva } from 'src/dominio/entidades';
import { CrearReservaDto } from './dto/crear.reserva.dto';
import { ArticuloNoEncontradoError, CantidadExcesivaError, ClienteNoEncontradoError, DisponibilidadInsuficienteError, FechasInvalidasError } from 'src/dominio/errores';

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
        private readonly inventarioService: InventarioService
    ){}

    listar(): Promise<Reserva[]> {
        return this.reservasRepo.listar();
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
        if (!cliente) {
            throw new ClienteNoEncontradoError(dto.clienteId);
        }

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

            const piezasReservadas = await this.reservasRepo.obtenerPiezasReservadasPeriodo(articulo.id, dto.fechaEntrega, dto.fechaRecoleccion);
            const piezasMantenimiento = await this.inventarioService.obtenerCantidadPiezasMantenimientoPeriodo(articulo.id, dto.fechaEntrega, dto.fechaRecoleccion);
            if ((piezasReservadas + piezasMantenimiento + a.cantidad) > articulo.existencias) throw new DisponibilidadInsuficienteError(articulo.nombre);
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

    obtenerPiezasReservadas(articuloId: number): Promise<number> {
        return this.reservasRepo.obtenerPiezasReservadas(articuloId);
    }

    obtenerPiezasReservadasPeriodo(articuloId: number, fechaInicio: Date, fechaFin: Date): Promise<number> {
        return this.reservasRepo.obtenerPiezasReservadasPeriodo(articuloId, fechaInicio, fechaFin);
    }

    eliminar(id: number): Promise<Reserva | null> {
        return this.reservasRepo.eliminar(id);
    }
}
