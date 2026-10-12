import { Inject, Injectable } from '@nestjs/common';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import type { ArticuloRepository } from './repositorios/articulo.repository';
import { AJUSTE_EXISTENCIA_REPOSITORY, ARTICULO_REPOSITORY, PIEZAS_MANTENIMIENTO_REPOSITORY } from './inventario.tokens';
import type { AjusteExistenciaRepository } from './repositorios/ajuste.existencia.repository';
import type { PiezasMantenimientoRepository } from './repositorios/piezas.mantenimiento.repository';
import { AjusteExistencia, Articulo, FiltrosArticulo } from 'src/dominio/entidades';
import { CrearArticuloDto } from './dto/crear.articulo.dto';
import { ReservasService } from 'src/reservas/reservas.service';
import { AjustarExistenciaDto } from './dto/ajustar.existencia.dto';
import { AdminNoEncontradoError, ArticuloNoEncontradoError, EstadoAjusteNoValido, ReduccionStockInvalidaError } from 'src/dominio/errores';

@Injectable()
export class InventarioService {

    constructor(
        @Inject(ARTICULO_REPOSITORY)
        private readonly articuloRepo: ArticuloRepository,
        @Inject(AJUSTE_EXISTENCIA_REPOSITORY)
        private readonly ajusteRepo: AjusteExistenciaRepository,
        @Inject(PIEZAS_MANTENIMIENTO_REPOSITORY)
        private readonly piezasRepo: PiezasMantenimientoRepository,
        private readonly usuariosService: UsuariosService,
        private readonly reservasService: ReservasService
    ) { }

    listarArticulos(): Promise<Articulo[]> {
        return this.articuloRepo.listar();
    }

    buscarArticuloPorId(idArticulo: number): Promise<Articulo | null> {
        return this.articuloRepo.buscarPorId(idArticulo);
    }

    busquedaArticulosFiltrada(filtros: FiltrosArticulo): Promise<Articulo[]> {
        return this.articuloRepo.busquedaFiltrada(filtros);
    }

    crear(dto: CrearArticuloDto): Promise<Articulo> {
        // Faltaría almacenar las imágenes en disco
        return this.articuloRepo.crear({
            nombre: dto.nombre,
            descripcion: dto.descripcion,
            precioPorDia: dto.precioPorDia,
            existencias: dto.existencias,
            categoria: dto.categoria,
            fotografiasUrl: dto.fotografiasUrl
        });
    }

    // REGLA DE NEGOCIO 07
    async obtenerDisponibilidad(id: number, fechaInicio: Date, fechaFin: Date): Promise<number> {
        let cantidadDisponible = 0;
        const piezasReservadas = await this.reservasService.obtenerPiezasReservadasPeriodo(id, fechaInicio, fechaFin);
        const piezasMantenimiento = await this.piezasRepo.obtenerCantidadPorPeriodo(id, fechaInicio, fechaFin);
        cantidadDisponible -= (piezasMantenimiento + piezasReservadas);
        return (cantidadDisponible > 0) ? cantidadDisponible: 0;
    }

    async ajustarExistencia(dto: AjustarExistenciaDto): Promise<AjusteExistencia> {
        // Verifica la existencia del artículo
        const articulo = await this.articuloRepo.buscarPorId(dto.articuloId);
        if (!articulo) throw new ArticuloNoEncontradoError(dto.articuloId);

        // Verifica la existencia del administrador
        const admin = await this.usuariosService.buscarAdminPorId(dto.adminId);
        if (!admin) throw new AdminNoEncontradoError(dto.adminId);

        // Nuevas existencias del artículo
        let existencias = articulo.existencias;

        // REGLA DE NEGOCIO 05 - PROHIBICION DE DECREMENTO DE EXISTENCIAS
        if (!dto.esIncremento) {
            const piezasReservadas = await this.reservasService.obtenerPiezasReservadas(dto.articuloId);
            const piezasMantenimiento = await this.piezasRepo.obtenerCantidad(dto.articuloId);
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
        await this.articuloRepo.actualizar(articulo.id, { existencias: existencias });

        return this.ajusteRepo.crear({ ...dto });
    }

    async obtenerCantidadPiezasMantenimiento(articuloId: number): Promise<number> {
        return this.piezasRepo.obtenerCantidad(articuloId);
    }

    async obtenerCantidadPiezasMantenimientoPeriodo(articuloId: number, fechaInicio: Date, fechaFin: Date): Promise<number> {
        return this.piezasRepo.obtenerCantidadPorPeriodo(articuloId, fechaInicio, fechaFin);
    }
}
