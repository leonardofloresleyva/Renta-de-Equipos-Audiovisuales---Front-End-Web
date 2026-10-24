import type { Direccion } from 'src/dominio/entidades';

export interface DireccionRespuestaDto {
  id: number;
  calle: string;
  colonia: string;
  numero: string;
}

export function aDireccionDto(direccion: Direccion): DireccionRespuestaDto {
  return {
    id: direccion.id,
    calle: direccion.calle,
    colonia: direccion.colonia,
    numero: direccion.numero,
  };
}
