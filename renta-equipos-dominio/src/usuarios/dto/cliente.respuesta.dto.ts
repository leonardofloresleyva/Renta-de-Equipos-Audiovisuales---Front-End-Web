import type { Cliente, Rol } from 'src/dominio/entidades';
import {
  aDireccionDto,
  type DireccionRespuestaDto,
} from './direccion.respuesta.dto';

export interface ClienteRespuestaDto {
  id: number;
  correo: string;
  rol: Rol;
  creadoEn: Date;
  nombre: string;
  telefono: string;
  direccion: DireccionRespuestaDto;
}

export function aClienteDto(cliente: Cliente): ClienteRespuestaDto {
  return {
    id: cliente.id,
    correo: cliente.email,
    rol: cliente.rol,
    creadoEn: cliente.creadoEn,
    nombre: cliente.nombre,
    telefono: cliente.telefono,
    direccion: aDireccionDto(cliente.direccion),
  };
}
