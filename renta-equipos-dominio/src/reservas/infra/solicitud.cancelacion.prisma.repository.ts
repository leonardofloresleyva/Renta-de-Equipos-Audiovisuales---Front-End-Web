import { PrismaService } from "src/prisma/prisma.service";
import { SolicitudCancelacionRepository } from "../repositorios/solicitud.cancelacion.repository";
import { FiltrosSolicitud, NuevaSolicitud, SolicitudCancelacion } from "src/dominio/entidades";
import { connect } from "http2";

export class SolicitudCancelacionPrismaRepository implements SolicitudCancelacionRepository {
    constructor(private readonly prisma: PrismaService) {}

    async listar(filtros?: FiltrosSolicitud): Promise<SolicitudCancelacion[]> {
        if (!filtros) return this.prisma.solicitudCancelacion.findMany() as Promise<SolicitudCancelacion[]>;
        return this.prisma.solicitudCancelacion.findMany({
            where: {
                fechaSolicitud: { gte: filtros.fechaInicio, lte: filtros.fechaFin },
                estadoSolicitud: filtros.estado
            }
        }) as Promise<SolicitudCancelacion[]>;
    }

    async buscarPorId(id: number): Promise<SolicitudCancelacion | null> {
        return this.prisma.solicitudCancelacion.findUnique({ where: { id } }) as Promise<SolicitudCancelacion | null>;
    }

    async buscarPorCliente(idCliente: number): Promise<SolicitudCancelacion[]> {
        return this.prisma.solicitudCancelacion.findMany({ where: { clienteId: idCliente } }) as Promise<SolicitudCancelacion[]>;
    }

    async buscarPorReserva(idReserva: number): Promise<SolicitudCancelacion | null> {
        return this.prisma.solicitudCancelacion.findUnique({ where: { reservaId: idReserva } }) as Promise<SolicitudCancelacion | null>;
    }

    async crear(datos: NuevaSolicitud): Promise<SolicitudCancelacion> {
        return this.prisma.solicitudCancelacion.create({
            data: {
                cliente: { connect: { id: datos.clienteId }},
                reserva: {connect: { id: datos.reservaId}},
                fechaSolicitud: new Date()
            }
        }) as Promise<SolicitudCancelacion>;
    }

    async rechazar(id: number): Promise<SolicitudCancelacion | null> {
        const solicitud = this.prisma.solicitudCancelacion.findUnique({ where: {id} });
        if (!solicitud) return null;
        return this.prisma.solicitudCancelacion.update({
            where: {
                id: id
            }, data: {
                estadoSolicitud: "rechazada"
            }
        }) as Promise<SolicitudCancelacion>;
    }
}