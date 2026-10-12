import { NuevaSolicitud, SolicitudCancelacion } from "src/dominio/entidades";
import { SolicitudCancelacionRepository } from "../repositorios/solicitud.cancelacion.repository";
import { SOLICITUDES_CANCELACION } from "src/datos/renta.equipo.seed";

export class SolicitudCancelacionMemoriaRepository implements SolicitudCancelacionRepository {

    private proximoId = 1;

    async listar(): Promise<SolicitudCancelacion[]> {
        return [...SOLICITUDES_CANCELACION.values()];
    }

    async buscarPorId(id: number): Promise<SolicitudCancelacion | null> {
        const solicitud = SOLICITUDES_CANCELACION.get(id);
        return (solicitud) ? solicitud: null;
    }

    async buscarPorCliente(idCliente: number): Promise<SolicitudCancelacion[]> {
        return [...SOLICITUDES_CANCELACION.values()].filter((s) => s.clienteId === idCliente);
    }

    async buscarPorReserva(idReserva: number): Promise<SolicitudCancelacion | null> {
        const solicitud = [...SOLICITUDES_CANCELACION.values()].find((s) => s.reservadId === idReserva);
        return (solicitud) ? solicitud : null;
    }

    async crear(datos: NuevaSolicitud): Promise<SolicitudCancelacion> {
        const id = this.proximoId++;
        const nuevaSolicitud: SolicitudCancelacion = {
            id: id,
            clienteId: datos.clienteId,
            reservadId: datos.reservadId,
            fechaSolicitud: new Date(),
            estadoSolicitud: 'pendiente'
        };
        SOLICITUDES_CANCELACION.set(id, nuevaSolicitud);
        return nuevaSolicitud;
    }

    async actualizar(id: number, datos: Partial<SolicitudCancelacion>): Promise<SolicitudCancelacion | null> {
        const solicitud = SOLICITUDES_CANCELACION.get(id);
        if (!solicitud) return null;

        const solicitudActualizada: SolicitudCancelacion = {
            ...solicitud,
            ...datos,
            id: solicitud.id
        };
        SOLICITUDES_CANCELACION.set(id, solicitudActualizada);
        return solicitudActualizada;
    }

    async eliminar(id: number): Promise<SolicitudCancelacion | null> {
        const solicitud = SOLICITUDES_CANCELACION.get(id);
        if (!solicitud) return null;
        solicitud.estadoSolicitud = 'rechazada';
        return solicitud;
    }
}