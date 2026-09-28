export interface CrearArticuloDto {
  nombre: string;
  descripcion: string;
  precioPorDia: number;
  existencias: number;
  categoria: string;
  fotografiasUrl: string[];
  activo?: boolean;
}
