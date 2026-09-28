import type { Direccion, EstadoReserva } from '../dominio/entidades';

export interface ItemReservaDto {
  articuloId: number | string;
  cantidad: number;
  precioUnitario?: number;
}

export interface DepositoGarantiaDto {
  costo: number;
  confirmado?: boolean;
  devuelto?: boolean;
}

export interface CrearReservaDto {
  folio?: number;
  clienteId?: number | string;
  fechaEntrega: Date | string;
  fechaRecoleccion: Date | string;
  direccionEntrega: Direccion;
  articulos?: ItemReservaDto[];
  items?: ItemReservaDto[]; // Alias de compatibilidad
  montoTotal?: number;
  estado?: EstadoReserva;
  depositoGarantia?: DepositoGarantiaDto;
}
