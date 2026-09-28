export interface ActualizarArticuloDto {
  nombre?: string;
  descripcion?: string;
  precioPorDia?: number;
  existencias?: number;
  categoria?: string;
  fotografiasUrl?: string[];
  activo?: boolean;
}
