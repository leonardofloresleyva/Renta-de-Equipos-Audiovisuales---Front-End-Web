import { FiltrosSolicitud, NuevaSolicitud, SolicitudCancelacion } from "src/dominio/entidades";
import { SolicitudCancelacionRepository } from "../repositorios/solicitud.cancelacion.repository";
import { SOLICITUDES_CANCELACION } from "src/datos/renta.equipo.seed";

export class SolicitudCancelacionMemoriaRepository implements SolicitudCancelacionRepository {

    private proximoId = 1;

    async listar(filtros?: FiltrosSolicitud): Promise<SolicitudCancelacion[]> {
        const solicitudes = [...SOLICITUDES_CANCELACION.values()];
        
        if (!filtros || Object.keys(solicitudes).length == 0) return solicitudes;
        
        return solicitudes.filter((s) => {
            if (filtros.fechaInicio && s.fechaSolicitud < filtros.fechaInicio) return false;
            if (filtros.fechaFin && s.fechaSolicitud > filtros.fechaFin) return false;
            if (filtros.estado && s.estadoSolicitud !== filtros.estado) return false;
            return true;
        });
    }

    async buscarPorId(id: number): Promise<SolicitudCancelacion | null> {
        const solicitud = SOLICITUDES_CANCELACION.get(id);
        return (solicitud) ? solicitud : null;
    }

    async buscarPorCliente(idCliente: number): Promise<SolicitudCancelacion[]> {
        return [...SOLICITUDES_CANCELACION.values()].filter((s) => s.clienteId === idCliente);
    }

    async buscarPorReserva(idReserva: number): Promise<SolicitudCancelacion | null> {
        const solicitud = [...SOLICITUDES_CANCELACION.values()].find((s) => s.reservaId === idReserva);
        return (solicitud) ? solicitud : null;
    }

    async crear(datos: NuevaSolicitud): Promise<SolicitudCancelacion> {
        const id = this.proximoId++;
        const nuevaSolicitud: SolicitudCancelacion = {
            id: id,
            clienteId: datos.clienteId,
            reservaId: datos.reservaId,
            fechaSolicitud: new Date(),
            estadoSolicitud: 'pendiente'
        };
        SOLICITUDES_CANCELACION.set(id, nuevaSolicitud);
        return nuevaSolicitud;
    }

    async rechazar(id: number): Promise<SolicitudCancelacion | null> {
        const solicitud = SOLICITUDES_CANCELACION.get(id);
        if (!solicitud) return null;
        solicitud.estadoSolicitud = 'rechazada';
        return solicitud;
    }
}