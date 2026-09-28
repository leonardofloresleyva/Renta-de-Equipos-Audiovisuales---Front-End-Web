export interface Admin {
  id: number;
  nombre: string;
  email: string;
  password?: string;
  rol: string;
  telefono?: string;
  activo: boolean;
  creadoEn?: Date;
  actualizadoEn?: Date;
}

export type Administrador = Admin;

export interface Articulo {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  cantidadTotal: number;
  precioPorDia: number;
  depositoGarantia: number;
  imagenUrl?: string;
  activo: boolean;
  creadoEn?: Date;
  actualizadoEn?: Date;
}

export interface Cliente {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  direccion?: string;
  identificacion?: string;
  activo: boolean;
  creadoEn?: Date;
  actualizadoEn?: Date;
}

export type EstadoReserva =
  | 'PENDIENTE'
  | 'CONFIRMADA'
  | 'ENTREGADA'
  | 'FINALIZADA'
  | 'CANCELADA';

export interface DetalleReserva {
  id?: number;
  articuloId: number;
  articulo?: Articulo;
  cantidad: number;
  precioUnitarioPorDia: number;
  depositoGarantiaUnitario: number;
  subtotal: number;
}

export interface Reserva {
  id: number;
  clienteId: number;
  cliente?: Cliente;
  fechaInicio: Date | string;
  fechaFin: Date | string;
  estado: EstadoReserva;
  depositoGarantiaTotal: number;
  montoTotal: number;
  items: DetalleReserva[];
  creadoEn?: Date;
  actualizadoEn?: Date;
}
