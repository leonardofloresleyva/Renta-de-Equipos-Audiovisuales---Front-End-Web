import type { ActualizarReservaDto } from '../dto/actualizar-reserva.dto';
import type { CrearReservaDto } from '../dto/crear-reserva.dto';
import type { Reserva } from './entidades';

export interface ReservaRepository {
  listar(): Promise<Reserva[]>;
  buscarPorId(id: number): Promise<Reserva | null>;
  crear(datos: CrearReservaDto): Promise<Reserva>;
  actualizar(id: number, datos: ActualizarReservaDto): Promise<Reserva | null>;
  eliminar(id: number): Promise<Reserva | null>;
  buscarPorCliente?(clienteId: number): Promise<Reserva[]>;
}
