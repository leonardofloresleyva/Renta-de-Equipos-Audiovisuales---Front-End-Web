import type { Direccion } from '../dominio/entidades';

export interface CrearClienteDto {
  email: string;
  password: string;
  nombre: string;
  telefono: string;
  direccion: Direccion;
  activo?: boolean;
}
