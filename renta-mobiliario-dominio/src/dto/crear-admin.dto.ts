export interface CrearAdminDto {
  nombre: string;
  email: string;
  password?: string;
  rol?: string;
  telefono?: string;
  activo?: boolean;
}
