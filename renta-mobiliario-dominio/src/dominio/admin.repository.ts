import type { ActualizarAdminDto } from '../dto/actualizar-admin.dto';
import type { CrearAdminDto } from '../dto/crear-admin.dto';
import type { Admin } from './entidades';

export interface AdminRepository {
  listar(): Promise<Admin[]>;
  buscarPorId(id: number): Promise<Admin | null>;
  crear(datos: CrearAdminDto): Promise<Admin>;
  actualizar(id: number, datos: ActualizarAdminDto): Promise<Admin | null>;
  eliminar(id: number): Promise<Admin | null>;
}
