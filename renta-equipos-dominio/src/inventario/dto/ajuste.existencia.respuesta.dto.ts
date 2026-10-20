import type { AjusteExistencia } from 'src/dominio/entidades';

export interface AjusteExistenciaRespuestaDto {
  id: number;
  articuloId: number;
  adminId: number;
  cantidad: number;
  esIncremento: boolean;
  motivo: AjusteExistencia['motivo'];
  creadoEn: Date;
}

export function aAjusteExistenciaDto(
  ajuste: AjusteExistencia,
): AjusteExistenciaRespuestaDto {
  return {
    id: ajuste.id,
    articuloId: ajuste.articuloId,
    adminId: ajuste.adminId,
    cantidad: ajuste.cantidad,
    esIncremento: ajuste.esIncremento,
    motivo: ajuste.motivo,
    creadoEn: ajuste.creadoEn,
  };
}
