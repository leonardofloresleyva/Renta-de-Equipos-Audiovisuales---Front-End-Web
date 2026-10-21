import type { Articulo } from 'src/dominio/entidades';

export interface ArticuloRespuestaDto {
  id: number;
  nombre: string;
  descripcion: string;
  precioPorDia: number;
  existencias: number;
  categoria: string;
  fotografiasUrl: string[];
}

export function aArticuloDto(articulo: Articulo): ArticuloRespuestaDto {
  return {
    id: articulo.id,
    nombre: articulo.nombre,
    descripcion: articulo.descripcion,
    precioPorDia: articulo.precioPorDia,
    existencias: articulo.existencias,
    categoria: articulo.categoria,
    fotografiasUrl: [...articulo.fotografiasUrl],
  };
}
