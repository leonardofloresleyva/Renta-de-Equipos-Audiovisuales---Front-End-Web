import { SolicitudCancelacion } from "src/dominio/entidades";

export interface SolicitudRespuestaDto {
    clienteId: number;
    reservaId: number;
    fechaSolicitud: Date;
    estadoSolicitud: string;
}

export function aSolicitudDto(s: SolicitudCancelacion): SolicitudRespuestaDto {
    return {
        clienteId: s.clienteId,
        reservaId: s.reservaId,
        fechaSolicitud: s.fechaSolicitud,
        estadoSolicitud: s.estadoSolicitud
    };
}