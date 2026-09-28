import type { MotivoAjuste } from "src/dominio";

export interface AjustarExistenciaDto {
    articuloId: number;
    adminId: number;
    cantidad: number;
    esIncremento: boolean;
    motivo: MotivoAjuste;
}