import { Inject, Injectable } from '@nestjs/common';
import { ADMIN_REPOSITORY, ARTICULO_REPOSITORY, CLIENTE_REPOSITORY, RESERVA_REPOSITORY } from './reservas.tokens';
import { CrearReservaDto } from 'src/dto/crear.reserva.dto';
import type { ClienteRepository } from 'src/dominio/cliente.repository';
import type { ArticuloRepository } from 'src/dominio/articulo.repository';
import type { ReservaRepository } from 'src/dominio/reserva.repository';
import type { AdminRepository } from 'src/dominio/admin.repository';
import { ArticuloReserva, NuevaReserva, NuevoArticuloReserva, nuevoFolio, porcentajeGarantia, Reserva } from 'src/dominio/entidades';
import { ArticuloNoEncontradoError, CantidadExcesivaError, ClienteNoEncontradoError, DisponibilidadInsuficienteError, FechasInvalidasError } from 'src/dominio/errores';

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

    buscarArticulosPorId(reservaId: number): Promise<ArticuloReserva[]> {
        return this.reservasRepo.buscarArticulosPorId(reservaId);
    }

    async crear(dto: CrearReservaDto): Promise<Reserva> {
        // Verificar a cliente asociado
        const cliente = await this.clientesRepo.buscarPorId(dto.clienteId);
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
            const articulo = await this.articulosRepo.buscarPorId(a.articuloId);
            if (!articulo) throw new ArticuloNoEncontradoError(a.articuloId);

            if (a.cantidad > articulo.existencias) throw new CantidadExcesivaError(articulo.id, a.cantidad - articulo.existencias);

            const piezasReservadas = await this.reservasRepo.obtenerPiezasReservadasPeriodo(articulo.id, dto.fechaEntrega, dto.fechaRecoleccion);
            const piezasMantenimiento = await this.adminRepo.obtenerCantidadPiezasMantenimientoPeriodo(articulo.id, dto.fechaEntrega, dto.fechaRecoleccion);
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

    buscarPorCliente(id: number): Promise<Reserva[]> {
        return this.reservasRepo.buscarPorCliente(id);
    }

 }
