import type { ArticuloReserva, NuevaReserva, NuevoArticuloReserva, Reserva } from './entidades';

export interface ReservaRepository {
  listar(): Promise<Reserva[]>;
  buscarPorId(id: number): Promise<Reserva | null>;
  buscarArticulosPorId(reservaId: number): Promise<ArticuloReserva[]>;
  crear(datosReserva: NuevaReserva, datosArticulos: NuevoArticuloReserva[]): Promise<Reserva>;
  actualizar(id: number, datos: Partial<Reserva>): Promise<Reserva | null>;
  eliminar(id: number): Promise<Reserva | null>;
  buscarPorCliente(clienteId: number): Promise<Reserva[]>;
  obtenerPiezasReservadas(articuloId: number): Promise<number>;
  obtenerPiezasReservadasPeriodo(articuloId: number, fechaInicio: Date, fechaFin: Date): Promise<number>;
}
