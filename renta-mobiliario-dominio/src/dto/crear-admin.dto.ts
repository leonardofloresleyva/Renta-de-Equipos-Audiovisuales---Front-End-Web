export interface CrearAdminDto {
  email: string;
  password: string;
  nombre: string;
  telefono: string;
  activo?: boolean;
}
