import { FiltrosSolicitud, NuevaSolicitud, SolicitudCancelacion } from "src/dominio/entidades";

export interface SolicitudCancelacionRepository {
    listar(filtros?: FiltrosSolicitud): Promise<SolicitudCancelacion[]>;
    buscarPorId(id: number): Promise<SolicitudCancelacion | null>;
    buscarPorReserva(idReserva: number): Promise<SolicitudCancelacion | null>;
    buscarPorCliente(idCliente: number): Promise<SolicitudCancelacion[]>;
    crear(datos: NuevaSolicitud): Promise<SolicitudCancelacion>;
    rechazar(id: number): Promise<SolicitudCancelacion | null>;
}