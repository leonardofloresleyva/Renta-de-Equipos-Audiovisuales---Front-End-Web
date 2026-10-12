import { DepositoGarantia } from "src/dominio/entidades";

export interface DepositoGarantiaRepository {
    listar(): Promise<DepositoGarantia[]>;
    buscarPorId(id: number): Promise<DepositoGarantia | null>;
    buscarPorReserva(idReserva: number): Promise<DepositoGarantia | null>;
    // Por ahora, es creado en ReservaMemoriaRepository
    // crear(datos: Omit<DepositoGarantia, 'id' | 'confirmado' | 'devuelto'>): Promise<DepositoGarantia>;
    actualizar(id: number, datos: Partial<DepositoGarantia>): Promise<DepositoGarantia | null>;
}