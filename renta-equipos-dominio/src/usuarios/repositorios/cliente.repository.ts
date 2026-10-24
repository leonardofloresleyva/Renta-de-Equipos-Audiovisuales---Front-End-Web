import { Cliente, Direccion, NuevoUsuario } from 'src/dominio/entidades';

export interface ClienteRepository {
  listar(): Promise<Cliente[]>;
  buscarPorId(id: number): Promise<Cliente | null>;
  buscarPorEmail(email: string): Promise<Cliente | null>;
  crear(
    nuevo: NuevoUsuario,
    direccion: Omit<Direccion, 'id'>,
  ): Promise<Cliente>;
  actualizar(id: number, datos: Partial<Cliente>): Promise<Cliente | null>;
  eliminar(id: number): Promise<Cliente | null>;
}
