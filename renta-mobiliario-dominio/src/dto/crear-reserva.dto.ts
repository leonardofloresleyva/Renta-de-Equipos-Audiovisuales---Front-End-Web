import type { EstadoReserva } from '../dominio/entidades';

export interface ItemReservaDto {
  articuloId: number;
  cantidad: number;
}

export interface CrearReservaDto {
  clienteId: number;
  fechaInicio: Date | string;
  fechaFin: Date | string;
  items: ItemReservaDto[];
  estado?: EstadoReserva;
  depositoGarantiaTotal?: number;
  montoTotal?: number;
}
