import { PrismaService } from "src/prisma/prisma.service";
import { ArticuloReservaRepository } from "../repositorios/articulo.reserva.repository";
import { ArticuloReserva } from "src/dominio/entidades";

export class ArticuloReservaPrismaRepository implements ArticuloReservaRepository {
    constructor(private readonly prisma: PrismaService){}

    async listar(): Promise<ArticuloReserva[]> {
        return this.prisma.articuloReserva.findMany() as Promise<ArticuloReserva[]>;
    }

    async buscarPorId(id: number): Promise<ArticuloReserva | null> {
        return this.prisma.articuloReserva.findUnique({ where: {id} }) as Promise<ArticuloReserva | null>;
    }

    async buscarPorReserva(idReserva: number): Promise<ArticuloReserva[]> {
        return this.prisma.articuloReserva.findMany({ where: { reservaId: idReserva } }) as Promise<ArticuloReserva[]>;
    }
}