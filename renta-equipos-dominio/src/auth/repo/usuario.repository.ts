import { Direccion, NuevoUsuario, Rol } from "src/dominio/entidades";

export interface UsuarioAutenticado {
    usuarioId: number;
    perfilId: number;
    email: string;
    nombre: string;
    passwordHash: string;
    rol: Rol;
    creadoEn: Date;
}

export interface UsuarioRepository {
    buscarPorCorreo(correo: string): Promise<UsuarioAutenticado | null>;
    // Solo los clientes podrán registrarse; los administradores ya deberán existir en la base de datos
    registrarCliente(nuevo: NuevoUsuario, nuevaDireccion: Omit<Direccion, "id">): Promise<UsuarioAutenticado>;
}

export const USUARIO_REPOSITORY = 'USUARIO_REPOSITORY';