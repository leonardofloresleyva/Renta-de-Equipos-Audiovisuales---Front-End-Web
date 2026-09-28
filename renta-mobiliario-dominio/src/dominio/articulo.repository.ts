import type { Articulo } from './entidades';

export interface ArticuloRepository {
  listar(): Promise<Articulo[]>;
  buscarPorId(id: number): Promise<Articulo | null>;
  crear(datos: Omit<Articulo, 'id'>): Promise<Articulo>;
  actualizar(id: number, datos: Partial<Articulo>): Promise<Articulo | null>;
  eliminar(id: number): Promise<Articulo | null>;
}
