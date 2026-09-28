import type { Direccion, EstadoReserva } from '../dominio/entidades';
import type { DepositoGarantiaDto, ItemReservaDto } from './crear-reserva.dto';

export interface ActualizarReservaDto {
  fechaEntrega?: Date | string;
  fechaRecoleccion?: Date | string;
  estado?: EstadoReserva;
  direccionEntrega?: Partial<Direccion>;
  articulos?: ItemReservaDto[];
  items?: ItemReservaDto[];
  montoTotal?: number;
  depositoGarantia?: Partial<DepositoGarantiaDto>;
}
