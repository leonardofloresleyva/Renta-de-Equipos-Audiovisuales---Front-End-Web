import type { ActualizarArticuloDto } from '../dto/actualizar-articulo.dto';
import type { CrearArticuloDto } from '../dto/crear-articulo.dto';
import type { Articulo } from './entidades';

export interface ArticuloRepository {
  listar(): Promise<Articulo[]>;
  buscarPorId(id: number): Promise<Articulo | null>;
  crear(datos: CrearArticuloDto): Promise<Articulo>;
  actualizar(id: number, datos: ActualizarArticuloDto): Promise<Articulo | null>;
  eliminar(id: number): Promise<Articulo | null>;
}
