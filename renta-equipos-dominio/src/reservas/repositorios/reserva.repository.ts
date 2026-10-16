import { NuevaReserva, NuevoArticuloReserva, Reserva } from "src/dominio/entidades";

export interface ReservaRepository {
    listar(): Promise<Reserva[]>;
    buscarPorId(id: number): Promise<Reserva | null>;
    buscarPorFolio(folio: string): Promise<Reserva | null>;
    buscarPorCliente(clienteId: number): Promise<Reserva[]>;
    crear(datosReserva: NuevaReserva, datosArticulos: NuevoArticuloReserva[]): Promise<Reserva>;
    actualizar(id: number, datos: Partial<Reserva>): Promise<Reserva | null>;
    eliminar(id: number): Promise<Reserva | null>;
}