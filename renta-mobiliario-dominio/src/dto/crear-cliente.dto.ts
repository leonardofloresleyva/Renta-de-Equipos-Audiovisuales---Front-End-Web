export interface CrearClienteDto {
  nombre: string;
  email: string;
  telefono: string;
  direccion?: string;
  identificacion?: string;
  activo?: boolean;
}
