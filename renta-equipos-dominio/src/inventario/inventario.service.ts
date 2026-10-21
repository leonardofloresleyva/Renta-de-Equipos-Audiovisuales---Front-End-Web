import { Inject, Injectable } from '@nestjs/common';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import type { ArticuloRepository } from './repositorios/articulo.repository';
import { AJUSTE_EXISTENCIA_REPOSITORY, ARTICULO_REPOSITORY, PIEZAS_MANTENIMIENTO_REPOSITORY } from './inventario.tokens';
import type { AjusteExistenciaRepository } from './repositorios/ajuste.existencia.repository';
import type { PiezasMantenimientoRepository } from './repositorios/piezas.mantenimiento.repository';
import {
    AjusteExistencia,
    Articulo,
    FiltrosArticulo,
    FiltrosAjusteExistencia,
    FiltrosMantenimiento,
    PiezasMantenimiento
} from 'src/dominio/entidades';
import { CrearArticuloDto } from './dto/crear.articulo.dto';
import { AjustarExistenciaDto } from './dto/ajustar.existencia.dto';
import { AdminNoEncontradoError, ArticuloNoEncontradoError, DisponibilidadInsuficienteError, EstadoAjusteNoValido, FechasInvalidasError, ReduccionStockInvalidaError } from 'src/dominio/errores';
import { CrearPiezaMantenimientoDto } from './dto/crear.pieza.mantenimiento.dto';
import { DisponibilidadService } from 'src/disponibilidad/disponibilidad.service';

@Injectable()
export class InventarioService {

    constructor(
        @Inject(ARTICULO_REPOSITORY)
        private readonly articuloRepo: ArticuloRepository,
        @Inject(AJUSTE_EXISTENCIA_REPOSITORY)
        private readonly ajusteRepo: AjusteExistenciaRepository,
        @Inject(PIEZAS_MANTENIMIENTO_REPOSITORY)
        private readonly piezasRepo: PiezasMantenimientoRepository,
        // Servicios de soporte
        private readonly usuariosService: UsuariosService,
        private readonly dispoService: DisponibilidadService
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

    listarAjustesExistencia(filtros: FiltrosAjusteExistencia = {}): Promise<AjusteExistencia[]> {
        return this.ajusteRepo.busquedaFiltrada(filtros);
    }

    listarPiezasMantenimiento(filtros: FiltrosMantenimiento = {}): Promise<PiezasMantenimiento[]> {
        return this.piezasRepo.busquedaFiltrada(filtros);
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

            const piezasApartadas = await this.dispoService.obtenerPiezasApartadas(dto.articuloId);
            const piezasDisponibles = articulo.existencias - piezasApartadas;
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

        return this.ajusteRepo.crearConActualizacionExistencias(
            { ...dto },
            articulo.existencias,
            existencias
        );
    }

    async registrarPiezasMantenimiento(dto: CrearPiezaMantenimientoDto): Promise<PiezasMantenimiento> {
        // Verifica la existencia del artículo
        const articulo = await this.articuloRepo.buscarPorId(dto.articuloId);
        if (!articulo) throw new ArticuloNoEncontradoError(dto.articuloId);

        // Verifica la existencia del administrador
        const admin = await this.usuariosService.buscarAdminPorId(dto.adminId);
        if (!admin) throw new AdminNoEncontradoError(dto.adminId);

        // Verifica la validez de las fechas
        if (dto.fechaInicio < new Date() || dto.fechaTermino < new Date() || dto.fechaTermino <= dto.fechaInicio) {
            throw new FechasInvalidasError();
        };

        // Verifica que se pueda apartar el artículo en el período (similar a la regla de negocio 01)
        const piezasApartadasPeriodo = await this.dispoService.obtenerPiezasApartadasPeriodo(articulo.id, dto.fechaInicio, dto.fechaTermino) + dto.cantidad;
        if (piezasApartadasPeriodo > articulo.existencias) throw new DisponibilidadInsuficienteError(articulo.nombre);

        return this.piezasRepo.crear({...dto});
    }
}
