import { Inject, Injectable } from '@nestjs/common';
import { type AdminRepository, ArticuloNoEncontradoError, ClienteNoEncontradoError, FechasReservaInvalidasError, type ArticuloRepository, type ClienteRepository, type Reserva, type ReservaRepository, DisponibilidadInsuficienteError, NuevoArticuloReserva, nuevoFolio, NuevaReserva } from 'src/dominio';
import { ADMIN_REPOSITORY, ARTICULO_REPOSITORY, CLIENTE_REPOSITORY, RESERVA_REPOSITORY } from './reservas.tokens';
import { CrearReservaDto } from 'src/dto/crear.reserva.dto';

@Injectable()
export class ReservasService {
    constructor(
        @Inject(CLIENTE_REPOSITORY)
        private readonly clientesRepo: ClienteRepository,
        @Inject(ARTICULO_REPOSITORY)
        private readonly articulosRepo: ArticuloRepository,
        @Inject(RESERVA_REPOSITORY)
        private readonly reservasRepo: ReservaRepository,
        @Inject(ADMIN_REPOSITORY)
        private readonly adminRepo: AdminRepository
    ) {}

    listar(): Promise<Reserva[]> {
        return this.reservasRepo.listar();
    }

    buscarPorId(id: number): Promise<Reserva | null> {
        return this.reservasRepo.buscarPorId(id);
    }

    async crear(dto: CrearReservaDto): Promise<Reserva> {
        // Verificar a cliente asociado
        const cliente = await this.clientesRepo.buscarPorId(dto.clienteId);
        if (!cliente) {
            throw new ClienteNoEncontradoError(dto.clienteId);
        }

        // REGLA DE NEGOCIO 02 - VERIFICAR FECHAS VÁlIDAS
        
        // Se ignora el tiempo de la fecha

        // Se verifica si el rango es válido (futuras y recolección después de entrega)
        if (dto.fechaEntrega < new Date() || dto.fechaRecoleccion < new Date() || dto.fechaRecoleccion <= dto.fechaEntrega) {
            throw new FechasReservaInvalidasError()
        };

        // REGLA DE NEGOCIO 01 - VERIFICAR DISPONIBILIDAD DE ARTÍCULOS
        const articulosReservados: NuevoArticuloReserva[] = [];
        let montoTotal = 0;
        // Se verifica que las existencias sean suficientes para cada artículo reservado
        for(let a of dto.articulos) {
            const articulo = await this.articulosRepo.buscarPorId(a.articuloId);
            if (!articulo) throw new ArticuloNoEncontradoError(a.articuloId);
            const piezasReservadas = await this.reservasRepo.obtenerPiezasReservadasPeriodo(articulo.id, dto.fechaEntrega, dto.fechaRecoleccion);
            const piezasMantenimiento = await this.adminRepo.obtenerCantidadPiezasMantenimientoPeriodo(articulo.id, dto.fechaEntrega, dto.fechaRecoleccion);
            if ((piezasReservadas + piezasMantenimiento) > articulo.existencias) throw new DisponibilidadInsuficienteError(articulo.nombre);
            const nuevoArticuloReservado = {
                articuloId: a.articuloId,
                cantidad: a.cantidad,
                precioUnitario: articulo.precioPorDia,
                subtotal: articulo.precioPorDia * a.cantidad
            };
            montoTotal += nuevoArticuloReservado.subtotal;
            articulosReservados.push();
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
            colonia: dto.colonia
        };
        return this.reservasRepo.crear(nuevaReserva, articulosReservados);
    }

    buscarPorCliente(id: number): Promise<Reserva[]> {
        return this.reservasRepo.buscarPorCliente(id);
    }

 }
