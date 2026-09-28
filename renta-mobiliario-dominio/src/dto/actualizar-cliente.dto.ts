import type { Direccion } from '../dominio/entidades';

export interface ActualizarClienteDto {
  email?: string;
  password?: string;
  nombre?: string;
  telefono?: string;
  direccion?: Partial<Direccion>;
  activo?: boolean;
}
