import type { Reserva } from './entidades';

export interface ReservaRepository {
  listar(): Promise<Reserva[]>;
  buscarPorId(id: number): Promise<Reserva | null>;
  crear(datos: Omit<Reserva, 'id'>): Promise<Reserva>;
  actualizar(id: number, datos: Partial<Reserva>): Promise<Reserva | null>;
  eliminar(id: number): Promise<Reserva | null>;
  buscarPorCliente?(clienteId: number): Promise<Reserva[]>;
}
