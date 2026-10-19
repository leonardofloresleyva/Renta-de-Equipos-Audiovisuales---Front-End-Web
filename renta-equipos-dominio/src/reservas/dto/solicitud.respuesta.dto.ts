import { SolicitudCancelacion } from "src/dominio/entidades";

export interface SolicitudRespuestaDto {
    clienteId: number;
    reservadId: number;
    fechaSolicitud: Date;
    estadoSolicitud: string;
}

export function aSolicitudDto(s: SolicitudCancelacion): SolicitudRespuestaDto {
    return {
        clienteId: s.clienteId,
        reservadId: s.reservadId,
        fechaSolicitud: s.fechaSolicitud,
        estadoSolicitud: s.estadoSolicitud
    };
}