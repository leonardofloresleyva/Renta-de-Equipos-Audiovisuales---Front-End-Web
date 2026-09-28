export interface CrearArticuloDto {
  nombre: string;
  descripcion: string;
  categoria: string;
  cantidadTotal: number;
  precioPorDia: number;
  depositoGarantia: number;
  imagenUrl?: string;
  activo?: boolean;
}
