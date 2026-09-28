/* ==========================================================================
   ENUMERACIONES (Diagrama de Dominio)
   ========================================================================== */

export enum EstadoSolicitud {
  PENDIENTE = 'PENDIENTE',
  APROBADA = 'APROBADA',
  APROVADA = 'APROVADA', // Alias admitido según diagrama
  RECHAZADA = 'RECHAZADA',
}

export enum EstadoReserva {
  APARTADA = 'APARTADA',
  ENTREGADA = 'ENTREGADA',
  DEVUELTA = 'DEVUELTA',
  CANCELADA = 'CANCELADA',
}

export enum MotivoAjuste {
  PERDIDA = 'PERDIDA',
  ADQUISICION = 'ADQUISICION',
  DETERIORO = 'DETERIORO',
}

export enum MotivoBloqueo {
  PREPARACION = 'PREPARACION',
  LIMPIEZA = 'LIMPIEZA',
}

/* ==========================================================================
   OBJETO DE VALOR / VALUE OBJECTS
   ========================================================================== */

export interface Direccion {
  numero: string;
  calle: string;
  colonia: string;
}

/* ==========================================================================
   ENTIDADES BASE Y USUARIOS
   ========================================================================== */

export interface Usuario {
  id?: number | string;
  email: string;
  password: string;
  activo?: boolean;
  creadoEn?: Date;
  actualizadoEn?: Date;
}

export interface Administrador extends Usuario {
  nombre: string;
  telefono: string;
  ajustesExistencia?: AjusteExistencia[];
  piezasMantenimiento?: PiezasMantenimiento[];
}

export type Admin = Administrador;

export interface Cliente extends Usuario {
  nombre: string;
  telefono: string;
  direccion: Direccion;
  reservas?: Reserva[];
  solicitudesCancelacion?: SolicitudCancelacion[];
}

/* ==========================================================================
   ARTÍCULOS E INVENTARIO
   ========================================================================== */

export interface Articulo {
  id?: number | string;
  nombre: string;
  descripcion: string;
  precioPorDia: number;
  existencias: number;
  categoria: string;
  fotografiasUrl: string[];
  activo?: boolean;
  creadoEn?: Date;
  actualizadoEn?: Date;
  articulosReserva?: ArticuloReserva[];
  ajustesExistencia?: AjusteExistencia[];
  piezasMantenimiento?: PiezasMantenimiento[];
}

export interface AjusteExistencia {
  id?: number | string;
  cantidad: number;
  tipo: boolean;
  motivo: MotivoAjuste;
  fechaHora: Date | string;
  articulo: Articulo;
  admin: Administrador;
}

export interface PiezasMantenimiento {
  id?: number | string;
  cantidad: number;
  fechaInicio: Date | string;
  fechaTermino: Date | string;
  motivo: MotivoBloqueo;
  articulo: Articulo;
  admin: Administrador;
}

/* ==========================================================================
   RESERVAS Y ASOCIACIONES
   ========================================================================== */

export interface ArticuloReserva {
  id?: number | string;
  cantidad: number;
  precioUnitario: number;
  articulo: Articulo;
  reserva?: Reserva;
  inspeccionPiezas?: InspeccionPiezas;
}

// Alias de compatibilidad
export type DetalleReserva = ArticuloReserva;

export interface DepositoGarantia {
  id?: number | string;
  costo: number;
  confirmado: boolean;
  devuelto: boolean;
  reserva?: Reserva;
}

export interface SolicitudCancelacion {
  id?: number | string;
  fechaSolicitud: Date | string;
  estadoSolicitud: EstadoSolicitud;
  cliente: Cliente;
  reserva?: Reserva;
}

export interface InspeccionPiezas {
  id?: number | string;
  piezasCompletas: number;
  piezasDanadas: number; // piezasDa帽adas
  piezasFaltantes: number;
  montoGarantia: number;
  articuloReservado: ArticuloReserva;
  bitacoraReserva?: BitacoraReserva;
}

export interface BitacoraReserva {
  id?: number | string;
  fechaHoraRecolectada: Date | string;
  fechaHoraEntregada: Date | string;
  montoTotalGarantia: number;
  reserva: Reserva;
  inspecciones?: InspeccionPiezas[];
}

export interface Reserva {
  id?: number | string;
  folio: number;
  montoTotal: number;
  fechaEntrega: Date | string;
  fechaRecoleccion: Date | string;
  estado: EstadoReserva;
  direccionEntrega: Direccion;
  cliente: Cliente;
  articulos?: ArticuloReserva[];
  depositoGarantia?: DepositoGarantia;
  solicitudCancelacion?: SolicitudCancelacion;
  bitacoraReserva?: BitacoraReserva;
  creadoEn?: Date;
  actualizadoEn?: Date;
}