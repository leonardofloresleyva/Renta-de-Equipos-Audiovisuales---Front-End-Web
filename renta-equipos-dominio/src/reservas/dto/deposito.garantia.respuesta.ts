import { DepositoGarantia } from "src/dominio/entidades";

export interface DepositoGarantiaRespuestaDto {
  id: number;
  reservaId: number;
  monto: number;
}

export function aDepositoGarantiaDto(d: DepositoGarantia): DepositoGarantiaRespuestaDto {
    return {
        id: d.id,
        reservaId: d.reservaId,
        monto: d.monto
    };
}