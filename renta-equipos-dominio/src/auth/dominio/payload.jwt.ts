import { Rol } from "src/dominio/entidades";

export interface PayloadJwt {
    sub: number;
    perfilId: number;
    correo: string;
    rol: Rol;
}