import { Injectable } from "@nestjs/common";
import { UsuarioRepository } from "../repo/usuario.repository";
import { ADMINS, CLIENTES } from "src/datos/renta.equipo.seed";
import { Cliente, Direccion, NuevoUsuario, Rol } from "src/dominio/entidades";
import type { UsuarioAutenticado } from "../repo/usuario.repository";

@Injectable()
export class UsuarioMemoriaRepository implements UsuarioRepository {
    private siguienteId = 3;

    constructor() {}

    buscarPorCorreo(correo: string): Promise<UsuarioAutenticado | null> {
        const buscado = correo.toLowerCase();
        const admin = [...ADMINS.values()].find((a) => a.email === buscado) ?? null;
        if (admin) return Promise.resolve({ usuarioId: admin.id, perfilId: admin.id, email: admin.email, passwordHash: admin.passwordHash, rol: admin.rol, creadoEn: admin.creadoEn });
        const cliente = [...CLIENTES.values()].find((c) => c.email === buscado) ?? null;
        return Promise.resolve((cliente) ? { usuarioId: cliente.id, perfilId: cliente.id, email: cliente.email, passwordHash: cliente.passwordHash, rol: cliente.rol, creadoEn: cliente.creadoEn } : null);
    }

    registrarCliente(nuevo: NuevoUsuario, nuevaDireccion: Omit<Direccion, "id">): Promise<UsuarioAutenticado> {
        const id = this.siguienteId++;
        const nuevoCliente: Cliente = {
            id,
            ...nuevo,
            rol: Rol.cliente,
            direccion: { id: id, ...nuevaDireccion},
            creadoEn: new Date()
        };
        CLIENTES.set(id, nuevoCliente);
        return Promise.resolve({
            usuarioId: id,
            perfilId: id,
            email: nuevoCliente.email,
            passwordHash: nuevoCliente.passwordHash,
            rol: nuevoCliente.rol,
            creadoEn: nuevoCliente.creadoEn,
        });
    }
}