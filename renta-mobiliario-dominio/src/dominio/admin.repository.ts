import type { Administrador } from './entidades';

export interface AdminRepository {
  listar(): Promise<Administrador[]>;
  buscarPorId(id: number): Promise<Administrador | null>;
  crear(datos: Omit<Administrador, 'id'>): Promise<Administrador>;
  actualizar(id: number, datos: Partial<Administrador>): Promise<Administrador | null>;
  eliminar(id: number): Promise<Administrador | null>;
}
