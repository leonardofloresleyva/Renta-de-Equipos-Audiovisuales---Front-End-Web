import { Reserva } from "src/dominio/entidades";
import { aArticuloReservaDto, ArticuloReservaRespuestaDto } from "./articulo.reserva.respuesta.dto";

export interface ReservaRespuestaDto {
    id: number;
    clienteId: number;
    folio: string;
    montoTotal: number;
    fechaEntrega: Date;
    fechaRecoleccion: Date;
    creadoEn: Date;
    estado: 'apartada'| 'entregada'| 'devuelta' | 'cancelada';
    calle: string;
    numero: string;
    colonia: string;
}

export function aReservaDto(r: Reserva): ReservaRespuestaDto {
    return {
        id: r.id,
        clienteId: r.clienteId,
        folio: r.folio,
        montoTotal: r.montoTotal,
        fechaEntrega: r.fechaEntrega,
        fechaRecoleccion: r.fechaRecoleccion,
        creadoEn: r.creadoEn,
        estado: r.estado,
        calle: r.direccionEntrega.calle,
        numero: r.direccionEntrega.numero,
        colonia: r.direccionEntrega.colonia
    };
}