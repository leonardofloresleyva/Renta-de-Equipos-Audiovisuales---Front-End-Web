import { FiltrosReserva, NuevaReserva, NuevoArticuloReserva, Reserva } from "src/dominio/entidades";

export interface ReservaRepository {
    listar(filtros: FiltrosReserva): Promise<Reserva[]>;
    buscarPorId(id: number): Promise<Reserva | null>;
    buscarPorFolio(folio: string): Promise<Reserva | null>;
    buscarPorCliente(clienteId: number): Promise<Reserva[]>;
    crear(datosReserva: NuevaReserva, datosArticulos: NuevoArticuloReserva[]): Promise<Reserva>;
    entregar(id: number): Promise<Reserva | null>;
    recolectar(id: number): Promise<Reserva | null>;
    cancelar(id: number): Promise<Reserva | null>;
}