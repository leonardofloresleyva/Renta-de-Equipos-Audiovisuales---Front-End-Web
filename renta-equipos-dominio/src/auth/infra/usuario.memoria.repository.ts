import { Injectable } from "@nestjs/common";
import { UsuarioRepository } from "../repo/usuario.repository";
import { ADMINS, CLIENTES } from "src/datos/renta.equipo.seed";
import { Cliente, Direccion, NuevoUsuario, Rol, Usuario } from "src/dominio/entidades";

@Injectable()
export class UsuarioMemoriaRepository implements UsuarioRepository {
    private siguienteId = 3;

    constructor() {}

    async buscarPorCorreo(correo: string): Promise<Usuario | null> {
        const buscado = correo.toLowerCase();
        const admin = [...ADMINS.values()].find((a) => a.email === buscado) ?? null;
        if (admin) return { id: admin.id, email: admin.email, passwordHash: admin.passwordHash, rol: admin.rol, creadoEn: admin.creadoEn };
        const cliente = [...CLIENTES.values()].find((c) => c.email === buscado) ?? null;
        return (cliente) ? { id: cliente.id, email: cliente.email, passwordHash: cliente.passwordHash, rol: cliente.rol, creadoEn: cliente.creadoEn } : null;
    }

    async registrarCliente(nuevo: NuevoUsuario, nuevaDireccion: Omit<Direccion, "id">): Promise<Cliente> {
        const id = this.siguienteId++;
        const nuevoCliente: Cliente = {
            id,
            ...nuevo,
            rol: Rol.cliente,
            direccion: { id: id, ...nuevaDireccion},
            creadoEn: new Date()
        };
        CLIENTES.set(id, nuevoCliente);
        return nuevoCliente;
    }
}