import { ArticuloReserva } from "src/dominio/entidades";

export interface ArticuloReservaRepository {
    listar(): Promise<ArticuloReserva[]>;
    buscarPorId(id: number): Promise<ArticuloReserva | null>;
    buscarPorReserva(idReserva: number): Promise<ArticuloReserva[]>;
    // Por ahora, el resto de métodos no se necesitan
}