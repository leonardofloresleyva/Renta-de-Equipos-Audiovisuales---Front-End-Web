import { Cliente, Direccion, NuevoUsuario, Usuario } from "src/dominio/entidades";

export interface UsuarioRepository {
    buscarPorCorreo(correo: string): Promise<Usuario | null>;
    // Solo los clientes podrán registrarse; los administradores ya deberán existir en la base de datos
    registrarCliente(nuevo: NuevoUsuario, nuevaDireccion: Omit<Direccion, "id">): Promise<Cliente>;
}

export const USUARIO_REPOSITORY = 'USUARIO_REPOSITORY';