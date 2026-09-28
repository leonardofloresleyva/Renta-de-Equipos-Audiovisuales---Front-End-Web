import type { EstadoReserva } from '../dominio/entidades';
import type { ItemReservaDto } from './crear-reserva.dto';

export interface ActualizarReservaDto {
  fechaInicio?: Date | string;
  fechaFin?: Date | string;
  estado?: EstadoReserva;
  items?: ItemReservaDto[];
  depositoGarantiaTotal?: number;
  montoTotal?: number;
}
