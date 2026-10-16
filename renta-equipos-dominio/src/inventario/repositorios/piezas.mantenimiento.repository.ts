import { FiltrosMantenimiento, PiezasMantenimiento } from "src/dominio/entidades";

export interface PiezasMantenimientoRepository {
    listar(): Promise<PiezasMantenimiento[]>;
    buscarPorId(id: number): Promise<PiezasMantenimiento | null>;
    busquedaFiltrada(filtros: FiltrosMantenimiento): Promise<PiezasMantenimiento[]>;
    crear(datos: Omit<PiezasMantenimiento, 'id'>): Promise<PiezasMantenimiento>;
}