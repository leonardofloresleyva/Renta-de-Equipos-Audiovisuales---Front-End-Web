import type { EstadoSolicitud } from '../dominio/entidades';

export interface CrearSolicitudCancelacionDto {
  reservaId: number | string;
  clienteId: number | string;
  fechaSolicitud?: Date | string;
  estadoSolicitud?: EstadoSolicitud;
}

export interface ActualizarSolicitudCancelacionDto {
  estadoSolicitud: EstadoSolicitud;
}
