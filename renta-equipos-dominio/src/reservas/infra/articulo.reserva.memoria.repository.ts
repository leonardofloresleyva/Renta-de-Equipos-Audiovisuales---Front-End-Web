import { ArticuloReserva } from "src/dominio/entidades";
import { ArticuloReservaRepository } from "../repositorios/articulo.reserva.repository";
import { ARTICULOS_RESERVA } from "src/datos/renta.equipo.seed";

export class ArticuloReservaMemoriaRepository implements ArticuloReservaRepository {
    
    async listar(): Promise<ArticuloReserva[]> {
        return [...ARTICULOS_RESERVA.values()];
    }

    async buscarPorId(id: number): Promise<ArticuloReserva | null> {
        const articulo = ARTICULOS_RESERVA.get(id);
        return (articulo) ? articulo : null;
    }

    async buscarPorReserva(idReserva: number): Promise<ArticuloReserva[]> {
        return [...ARTICULOS_RESERVA.values()].filter((a) => a.reservaId === idReserva);
    }
}