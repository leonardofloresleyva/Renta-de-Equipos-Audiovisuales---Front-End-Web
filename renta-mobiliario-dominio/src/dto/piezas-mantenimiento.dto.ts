import type { MotivoBloqueo } from '../dominio/entidades';

export interface CrearPiezasMantenimientoDto {
  articuloId: number | string;
  adminId: number | string;
  cantidad: number;
  fechaInicio: Date | string;
  fechaTermino: Date | string;
  motivo: MotivoBloqueo;
}
