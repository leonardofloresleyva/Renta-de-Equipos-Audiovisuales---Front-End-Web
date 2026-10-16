import { Inject, Injectable } from '@nestjs/common';
import type { DisponibilidadRepository } from './repo/disponibilidad.repository';
import { DISPONIBILIDAD_REPOSITORY } from './disponibilidad.tokens';
import { ArticuloNoEncontradoError } from 'src/dominio/errores';

@Injectable()
export class DisponibilidadService {

    constructor(
        @Inject(DISPONIBILIDAD_REPOSITORY)
        private readonly dispoRepo: DisponibilidadRepository
    ) {}
    // Se pueden resumir en dos métodos que devuelvan la disponibilidad en general y ya

    // REGLA DE NEGOCIO 07
    async obtenerDisponibilidadPeriodo(articuloId: number, fechaInicio: Date, fechaFin: Date): Promise<number> {
        const existencias = await this.dispoRepo.obtenerExistenciasArticulo(articuloId);
        if (!existencias) throw new ArticuloNoEncontradoError(articuloId);

        const piezasMantenimiento = await this.dispoRepo.obtenerPiezasMantenimientoPeriodo(articuloId, fechaInicio, fechaFin);
        const piezasReservadas = await this.dispoRepo.obtenerPiezasReservadasPeriodo(articuloId, fechaInicio, fechaFin);

        const cantidadDisponible = existencias -  (piezasMantenimiento + piezasReservadas);
        return (cantidadDisponible > 0) ? cantidadDisponible : 0;
    }

    async obtenerPiezasApartadas(articuloId: number): Promise<number> {
        const piezasMantenimiento = await this.dispoRepo.obtenerPiezasMantenimiento(articuloId);
        const piezasReservadas = await this.dispoRepo.obtenerPiezasReservadas(articuloId);
        return piezasMantenimiento + piezasReservadas;
    }

    async obtenerPiezasApartadasPeriodo(articuloId: number, fechaInicio: Date, fechaFin: Date): Promise<number> {
        const piezasMantenimiento = await this.dispoRepo.obtenerPiezasMantenimientoPeriodo(articuloId, fechaInicio, fechaFin);
        const piezasReservadas = await this.dispoRepo.obtenerPiezasReservadasPeriodo(articuloId, fechaInicio, fechaFin);
        return piezasMantenimiento + piezasReservadas;
    }

}
