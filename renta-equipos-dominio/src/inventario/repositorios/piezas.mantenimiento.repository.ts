import { FiltrosMantenimiento, PiezasMantenimiento } from "src/dominio/entidades";

export interface PiezasMantenimientoRepository {
    listar(): Promise<PiezasMantenimiento[]>;
    buscarPorId(id: number): Promise<PiezasMantenimiento | null>;
    busquedaFiltrada(filtros: FiltrosMantenimiento): Promise<PiezasMantenimiento[]>;
    obtenerCantidad(articuloId: number): Promise<number>;
    obtenerCantidadPorPeriodo(articuloId: number, fechaInicio: Date, fechaFin: Date): Promise<number>;
    crear(datos: Omit<PiezasMantenimiento, 'id'>): Promise<PiezasMantenimiento>;
}