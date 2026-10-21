// Porcentaje de garantía
export const porcentajeGarantia = 0.20;

// Lo que hace falta para crear
export interface NuevaReserva {
  clienteId: number;
  folio: string;
  montoTotal: number;
  fechaEntrega: Date;
  fechaRecoleccion: Date;
  numero: string;
  calle: string;
  colonia: string;
  montoGarantia: number;
}

// Tipos de entrada
export type NuevoArticuloReserva = Omit<ArticuloReserva, 'id' | 'reservaId'>;
export type RegistroEntradaBitacora = Omit<BitacoraReserva, 'id' | 'fechaHoraRecolectada' | 'fechaHoraEntregada'>;
export type NuevoInspeccionPieza = Omit<InspeccionPieza, 'id' | 'bitacoraReservaId'>;
export type NuevoAjusteExistencia = Omit<AjusteExistencia, 'id' | 'creadoEn'>;
export type NuevaSolicitud = Omit<SolicitudCancelacion, 'id' | 'fechaSolicitud' | 'estadoSolicitud'>;
export type NuevoUsuario = Omit<Cliente, 'id' | 'creadoEn' | 'rol' | 'direccion'>;

// Filtros
export interface FiltrosArticulo {
  nombre?: string;
  descripcion?: string;
  precioMinimo?: number;
  precioMaximo?: number;
  categoria?: string;
}

export interface FiltrosReserva {
  nombreCliente?: string;
  fechaEntrega?: Date;
  fechaRecoleccion?: Date;
  estado?: EstadoReserva;
}

export interface FiltrosAjusteExistencia {
  articuloId?: number;
  adminId?: number;
  cantidadMinima?: number;
  cantidadMaxima?: number;
  esIncremento?: boolean;
  motivo?: MotivoAjuste;
}

export interface FiltrosMantenimiento {
  articuloId?: number;
  adminId?: number;
  cantidadMinima?: number;
  cantidadMaxima?: number;
  fechaInicio?: Date;
  fechaTermino?: Date;
  motivo?: MotivoBloqueo;
}

export interface FiltrosSolicitud {
  fechaInicio?: Date;
  fechaFin?: Date;
  estado?: EstadoSolicitud;
}

// Genera un folio sencillo
export function nuevoFolio(): string {
  const numero = Math.floor(Math.random() * 1000000);
  return numero.toString().padStart(6, '0');
}

// Entidades de dominio
export enum Rol {
  cliente = "cliente",
  administrador = "administrador"
}

export interface Usuario {
  readonly id: number;
  readonly email: string;
  passwordHash: string;
  readonly rol: Rol;
  creadoEn: Date;
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
  readonly creadoEn: Date; // DATE TAMBIÉN PUEDE INCLUIR LA HORA
}

export type MotivoBloqueo = 'reparacion' | 'limpieza';

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
  readonly folio: string;
  montoTotal: number;
  fechaEntrega: Date;
  fechaRecoleccion: Date;
  readonly creadoEn: Date; // DATE TAMBIÉN PUEDE INCLUIR LA HORA
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

export interface InspeccionPieza {
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
  fechaHoraRecolectada?: Date; // DATE TAMBIÉN PUEDE INCLUIR LA HORA
  fechaHoraEntregada: Date; // DATE TAMBIÉN PUEDE INCLUIR LA HORA
  montoTotalGarantia: number;
}

export type EstadoSolicitud = 'pendiente' | 'aprobada' | 'rechazada';

export interface SolicitudCancelacion {
  readonly id: number;
  readonly clienteId: number;
  readonly reservaId: number;
  fechaSolicitud: Date;
  estadoSolicitud: EstadoSolicitud;
}