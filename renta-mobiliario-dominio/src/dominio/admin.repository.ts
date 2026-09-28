import type { ActualizarAdminDto } from '../dto/actualizar-admin.dto';
import type { CrearAdminDto } from '../dto/crear-admin.dto';
import type { Administrador } from './entidades';

export interface AdminRepository {
  listar(): Promise<Administrador[]>;
  buscarPorId(id: number): Promise<Administrador | null>;
  crear(datos: CrearAdminDto): Promise<Administrador>;
  actualizar(id: number, datos: ActualizarAdminDto): Promise<Administrador | null>;
  eliminar(id: number): Promise<Administrador | null>;
}
