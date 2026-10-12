import { DepositoGarantia } from "src/dominio/entidades";
import { DepositoGarantiaRepository } from "../repositorios/deposito.garantia.repository";
import { DEPOSITOS_GARANTIA } from "src/datos/renta.equipo.seed";

export class DepositoGarantiaMemoriaRepository implements DepositoGarantiaRepository {

    async listar(): Promise<DepositoGarantia[]> {
        return [...DEPOSITOS_GARANTIA.values()];
    }

    async buscarPorId(id: number): Promise<DepositoGarantia | null> {
        const deposito = DEPOSITOS_GARANTIA.get(id);
        return (deposito) ? deposito : null;
    }

    async buscarPorReserva(idReserva: number): Promise<DepositoGarantia | null> {
        const deposito = [...DEPOSITOS_GARANTIA.values()].find((d) => d.reservaId === idReserva);
        return (deposito) ? deposito : null;
    }

    async actualizar(id: number, datos: Partial<DepositoGarantia>): Promise<DepositoGarantia | null> {
        const deposito = DEPOSITOS_GARANTIA.get(id);
        if (!deposito) return null;
        const depositoActualizado: DepositoGarantia = {
            ...deposito,
            ...datos,
            id: deposito.id,
        };
        DEPOSITOS_GARANTIA.set(id, depositoActualizado);
        return depositoActualizado;
    }
}