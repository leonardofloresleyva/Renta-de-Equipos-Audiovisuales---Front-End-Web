import { BitacoraReserva, NuevoInspeccionPieza } from "src/dominio/entidades";

export interface BitacoraReservaRepository {
    listar(): Promise<BitacoraReserva[]>;
    buscarPorId(id: number): Promise<BitacoraReserva | null>;
    buscarPorReserva(idReserva: number): Promise<BitacoraReserva | null>;
    entregar(datos: Omit<BitacoraReserva, "id" | "fechaHoraEntregada" | 'fechaHoraRecolectada'>): Promise<BitacoraReserva>;
    recolectar(id: number, inspeccionesPiezas: NuevoInspeccionPieza[]): Promise<BitacoraReserva | null>;
    // eliminar(id: number): Promise<BitacoraReserva | null>;
}