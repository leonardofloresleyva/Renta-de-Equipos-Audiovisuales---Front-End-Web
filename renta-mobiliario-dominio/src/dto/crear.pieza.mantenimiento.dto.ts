import type { MotivoBloqueo } from "src/dominio";

export interface CrearPiezaMantenimientoDto {
  articuloId: number;
  adminId: number;
  cantidad: number;
  fechaInicio: Date | string;
  fechaTermino: Date | string;
  motivo: MotivoBloqueo;
}