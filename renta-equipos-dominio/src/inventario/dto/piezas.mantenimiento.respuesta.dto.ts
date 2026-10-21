import type { PiezasMantenimiento } from 'src/dominio/entidades';

export interface PiezasMantenimientoRespuestaDto {
  id: number;
  articuloId: number;
  adminId: number;
  cantidad: number;
  fechaInicio: Date;
  fechaTermino: Date;
  motivo: PiezasMantenimiento['motivo'];
}

export function aPiezasMantenimientoDto(
  mantenimiento: PiezasMantenimiento,
): PiezasMantenimientoRespuestaDto {
  return {
    id: mantenimiento.id,
    articuloId: mantenimiento.articuloId,
    adminId: mantenimiento.adminId,
    cantidad: mantenimiento.cantidad,
    fechaInicio: mantenimiento.fechaInicio,
    fechaTermino: mantenimiento.fechaTermino,
    motivo: mantenimiento.motivo,
  };
}
