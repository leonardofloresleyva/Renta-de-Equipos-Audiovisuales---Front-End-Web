import { Cliente } from "src/dominio/entidades";

export interface ClienteRepository {
  listar(): Promise<Cliente[]>;
  buscarPorId(id: number): Promise<Cliente | null>;
  buscarPorEmail(email: string): Promise<Cliente | null>;
  actualizar(id: number, datos: Partial<Cliente>): Promise<Cliente | null>;
  eliminar(id: number): Promise<Cliente | null>;
}
