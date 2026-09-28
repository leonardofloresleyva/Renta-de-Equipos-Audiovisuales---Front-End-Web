import type { Cliente } from './entidades';

export interface ClienteRepository {
  listar(): Promise<Cliente[]>;
  buscarPorId(id: number): Promise<Cliente | null>;
  crear(datos: Omit<Cliente, 'id'>): Promise<Cliente>;
  actualizar(id: number, datos: Partial<Cliente>): Promise<Cliente | null>;
  eliminar(id: number): Promise<Cliente | null>;
}
