import { Articulo } from "src/dominio/entidades";

export interface DisponibilidadRepository {
    obtenerExistenciasArticulo(id: number): Promise<number | null>;
    obtenerPiezasMantenimiento(articuloId: number): Promise<number>;
    obtenerPiezasMantenimientoPeriodo(articuloId: number, fechaInicio: Date, fechaFin: Date): Promise<number>;
    obtenerPiezasReservadas(articuloId: number): Promise<number>;
    obtenerPiezasReservadasPeriodo(articuloId: number, fechaInicio: Date, fechaFin: Date): Promise<number>;
}