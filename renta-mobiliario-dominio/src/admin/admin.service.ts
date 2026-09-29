import { Inject, Injectable } from '@nestjs/common';
import { AjustarExistenciaDto } from 'src/dto/ajustar.existencia.dto';
import { AdminNoEncontradoError, ArticuloNoEncontradoError, DisponibilidadInsuficienteError, EstadoAjusteNoValido, FechasInvalidasError, ReduccionStockInvalidaError } from 'src/dominio/errores';
import { ADMIN_REPOSITORY, ARTICULO_REPOSITORY, RESERVA_REPOSITORY } from './admin.tokens';
import type { ArticuloRepository } from 'src/dominio/articulo.repository';
import type { ReservaRepository } from 'src/dominio/reserva.repository';
import type { AdminRepository } from 'src/dominio/admin.repository';
import type { Administrador, AjusteExistencia, PiezasMantenimiento } from 'src/dominio/entidades';
import { CrearPiezaMantenimientoDto } from 'src/dto/crear.pieza.mantenimiento.dto';

@Injectable()
export class AdminService {

    constructor(
        @Inject(ARTICULO_REPOSITORY) 
        private readonly articuloRepo: ArticuloRepository,
        @Inject(RESERVA_REPOSITORY)
        private readonly reservasRepo: ReservaRepository,
        @Inject(ADMIN_REPOSITORY)
        private readonly adminRepo: AdminRepository
    ) {}

    async listar(): Promise<Administrador[]> {
        return this.adminRepo.listar();
    }

    async buscarPorId(id: number): Promise<Administrador | null> {
        return this.adminRepo.buscarPorId(id);
    }

    async ajustarExistencia(dto: AjustarExistenciaDto): Promise<AjusteExistencia> {
        // Verifica la existencia del artículo
        const articulo = await this.articuloRepo.buscarPorId(dto.articuloId);
        if (!articulo) throw new ArticuloNoEncontradoError(dto.articuloId);

        // Verifica la existencia del administrador
        const admin = await this.adminRepo.buscarPorId(dto.adminId);
        if (!admin) throw new AdminNoEncontradoError(dto.adminId);
        
        // Nuevas existencias del artículo
        let existencias = articulo.existencias;

        // REGLA DE NEGOCIO 05 - PROHIBICION DE DECREMENTO DE EXISTENCIAS
        if (!dto.esIncremento) {
            const piezasReservadas = await this.reservasRepo.obtenerPiezasReservadas(dto.articuloId);
            const piezasMantenimiento = await this.adminRepo.obtenerCantidadPiezasMantenimiento(dto.articuloId);
            const piezasDisponibles = articulo.existencias - (piezasReservadas + piezasMantenimiento);
            if (piezasDisponibles - dto.cantidad < 0) throw new ReduccionStockInvalidaError();

            // No pueden restarse existencias adquiridas
            if (dto.motivo === 'adquisicion') throw new EstadoAjusteNoValido(dto.esIncremento);

            // Se resta la cantidad a las existencias
            existencias -= dto.cantidad;
        } else {
            // No pueden adquirirse artículos dañados o perdidos
            if (dto.motivo !== 'adquisicion') throw new EstadoAjusteNoValido(dto.esIncremento);

            // Se suma la cantidad a las existencias
            existencias += dto.cantidad;
        }

        // Se actualiza el artículo con las nuevas existencias
        await this.articuloRepo.actualizar(articulo.id, {existencias: existencias});

        return this.adminRepo.registrarAjuste({...dto});
    }

    async registrarPiezasMantenimiento(dto: CrearPiezaMantenimientoDto): Promise<PiezasMantenimiento> {
        // Verifica la existencia del artículo
        const articulo = await this.articuloRepo.buscarPorId(dto.articuloId);
        if (!articulo) throw new ArticuloNoEncontradoError(dto.articuloId);

        // Verifica la existencia del administrador
        const admin = await this.adminRepo.buscarPorId(dto.adminId);
        if (!admin) throw new AdminNoEncontradoError(dto.adminId);

        // Verifica la validez de las fechas
        if (dto.fechaInicio < new Date() || dto.fechaTermino < new Date() || dto.fechaTermino <= dto.fechaInicio) {
            throw new FechasInvalidasError();
        };

        // Verifica que se pueda apartar el artículo en el período (similar a la regla de negocio 01)
        const piezasReservadas = await this.reservasRepo.obtenerPiezasReservadasPeriodo(articulo.id, dto.fechaInicio, dto.fechaTermino);
        const piezasMantenimiento = await this.adminRepo.obtenerCantidadPiezasMantenimientoPeriodo(articulo.id, dto.fechaInicio, dto.fechaTermino);
        if ((piezasReservadas + piezasMantenimiento + dto.cantidad) > articulo.existencias) throw new DisponibilidadInsuficienteError(articulo.nombre);

        return this.adminRepo.registrarPiezasMantenimiento({...dto});
    }
 }
