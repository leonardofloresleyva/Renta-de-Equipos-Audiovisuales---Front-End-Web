import { PrismaService } from "src/prisma/prisma.service";
import { DepositoGarantiaRepository } from "../repositorios/deposito.garantia.repository";
import { DepositoGarantia } from "src/dominio/entidades";
import { Injectable } from "@nestjs/common";

@Injectable()
export class DepositoGarantiaPrismaRepository implements DepositoGarantiaRepository {
    constructor(private readonly prisma: PrismaService) {}

    async listar(): Promise<DepositoGarantia[]> {
        return this.prisma.depositoGarantia.findMany() as Promise<DepositoGarantia[]>;
    }

    async buscarPorId(id: number): Promise<DepositoGarantia | null> {
        return this.prisma.depositoGarantia.findUnique({ where: { id } }) as Promise<DepositoGarantia | null>;
    }

    async buscarPorReserva(idReserva: number): Promise<DepositoGarantia | null> {
        return this.prisma.depositoGarantia.findUnique({ where: { reservaId: idReserva } }) as Promise<DepositoGarantia | null>;
    }

    async actualizar(id: number, datos: Partial<DepositoGarantia>): Promise<DepositoGarantia | null> {
        const deposito = await this.prisma.depositoGarantia.findUnique({ where: { id } });
        if (!deposito) return null;
        return this.prisma.depositoGarantia.update({
            where: { id},
            data: { 
                monto: datos.monto,
                confirmado: datos.confirmado,
                devuelto: datos.devuelto
            }
        }) as Promise<DepositoGarantia>;
    }
}