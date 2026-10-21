import { Rol } from "src/dominio/entidades";

export interface PayloadJwt {
    sub: number;
    correo: string;
    rol: Rol;
}