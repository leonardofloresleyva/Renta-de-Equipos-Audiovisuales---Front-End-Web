export interface CrearPiezaMantenimientoDto {
  articuloId: number;
  adminId: number;
  cantidad: number;
  fechaInicio: Date;
  fechaTermino: Date;
  motivo: 'reparacion' | 'limpieza';
}