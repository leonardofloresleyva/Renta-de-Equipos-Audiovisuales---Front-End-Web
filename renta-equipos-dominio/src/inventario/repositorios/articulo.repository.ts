import { Articulo, FiltrosArticulo } from "src/dominio/entidades";

export interface ArticuloRepository {
    listar(): Promise<Articulo[]>;
    buscarPorId(id: number): Promise<Articulo | null>;
    busquedaFiltrada(filtros: FiltrosArticulo): Promise<Articulo[]>;
    crear(datos: Omit<Articulo, 'id'>): Promise<Articulo>;
    actualizar(id: number, datos: Partial<Articulo>): Promise<Articulo | null>;
    eliminar(id: number): Promise<Articulo | null>;
}