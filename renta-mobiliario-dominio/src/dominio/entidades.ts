export interface Usuario {
  readonly id: number;
  readonly email: string;
  password: string;
}

export interface Administrador extends Usuario {
  nombre: string;
  telefono?: string;
}

export interface Cliente extends Usuario {
  nombre: string;
  telefono: string;
  direccion: Direccion;
}

export interface Direccion {
  readonly id: number;
  numero: string;
  calle: string;
  colonia: string;
}

export interface Articulo {
  readonly id: number;
  nombre: string;
  descripcion: string;
  precioPorDia: number;
  existencias: number;
  categoria: string;
  fotografiasUrl: string[];
}

export type MotivoAjuste = 'perdida' | 'adquisicion' | 'deterioro';

export interface AjusteExistencia {
  readonly id: number;
  readonly articuloId: number;
  readonly adminId: number;
  cantidad: number;
  esIncremento: boolean;
  motivo: MotivoAjuste;
  creadoEn: Date; // DATE TAMBIÉN PUEDE INCLUIR LA HORA
}

export type MotivoBloqueo = 'preparacion' | 'limpieza';

export interface PiezasMantenimiento {
  readonly id: number;
  readonly articuloId: number;
  readonly adminId: number;
  cantidad: number;
  fechaInicio: Date;
  fechaTermino: Date;
  motivo: MotivoBloqueo;
}

export interface ArticuloReserva {
  readonly id: number;
  readonly articuloId: number;
  readonly reservaId: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export type EstadoReserva = 'apartada'| 'entregada'| 'devuelta' | 'cancelada';

export interface Reserva {
  readonly id: number;
  readonly clienteId: number;
  readonly folio: number;
  montoTotal: number;
  fechaEntrega: Date;
  fechaRecoleccion: Date;
  creadoEn: Date; // DATE TAMBIÉN PUEDE INCLUIR LA HORA
  estado: EstadoReserva;
  direccionEntrega: Direccion;
}

export interface DepositoGarantia {
  readonly id: number;
  readonly reservaId: number;
  monto: number;
  confirmado: boolean;
  devuelto: boolean;
}

export interface InspeccionPiezas {
  readonly id: number;
  readonly articuloReservadoId: number;
  readonly bitacoraReservaId: number;
  piezasCompletas: number;
  piezasDaniadas?: number;
  piezasFaltantes?: number;
  montoGarantia?: number;
}

export interface BitacoraReserva {
  readonly id: number;
  readonly reservaId: number;
  fechaHoraRecolectada: Date; // DATE TAMBIÉN PUEDE INCLUIR LA HORA
  fechaHoraEntregada: Date; // DATE TAMBIÉN PUEDE INCLUIR LA HORA
  montoTotalGarantía: number;
}

export type EstadoSolicitud = 'pendiente' | 'aprovada' | 'rechazada';

export interface SolicitudCancelacion {
  readonly id: number;
  readonly clienteId: number;
  readonly reservadId: number;
  fechaSolicitud: Date;
  estadoSolicitud: EstadoSolicitud;
}