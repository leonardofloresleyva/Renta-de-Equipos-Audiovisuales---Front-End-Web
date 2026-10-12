import { NuevaSolicitud, SolicitudCancelacion } from "src/dominio/entidades";

export interface SolicitudCancelacionRepository {
    listar(): Promise<SolicitudCancelacion[]>;
    buscarPorId(id: number): Promise<SolicitudCancelacion | null>;
    buscarPorReserva(idReserva: number): Promise<SolicitudCancelacion | null>;
    buscarPorCliente(idCliente: number): Promise<SolicitudCancelacion[]>;
    crear(datos: NuevaSolicitud): Promise<SolicitudCancelacion>;
    actualizar(id: number, datos: Partial<SolicitudCancelacion>): Promise<SolicitudCancelacion | null>;
    eliminar(id: number): Promise<SolicitudCancelacion | null>;
}