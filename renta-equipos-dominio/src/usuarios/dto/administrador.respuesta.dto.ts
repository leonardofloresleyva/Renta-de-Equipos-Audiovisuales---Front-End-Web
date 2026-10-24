import type { Administrador, Rol } from 'src/dominio/entidades';

export interface AdministradorRespuestaDto {
  id: number;
  correo: string;
  rol: Rol;
  creadoEn: Date;
  nombre: string;
  telefono?: string;
}

export function aAdministradorDto(
  administrador: Administrador,
): AdministradorRespuestaDto {
  return {
    id: administrador.id,
    correo: administrador.email,
    rol: administrador.rol,
    creadoEn: administrador.creadoEn,
    nombre: administrador.nombre,
    telefono: administrador.telefono,
  };
}
