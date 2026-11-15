import { PrismaService } from "src/prisma/prisma.service";
import { Direccion, NuevoUsuario, Rol } from "src/dominio/entidades";
import { Injectable } from "@nestjs/common";
import type { UsuarioAutenticado, UsuarioRepository } from "../repo/usuario.repository";

@Injectable()
export class UsuarioPrismaRepository implements UsuarioRepository {
    constructor(private readonly prisma: PrismaService) { }

    async buscarPorCorreo(correo: string): Promise<UsuarioAutenticado | null> {
        const fila = await this.prisma.usuario.findUnique({
            where: { email: correo.toLowerCase() },
            include: {
                cliente: { select: { id: true } },
                administrador: { select: { id: true } },
            },
        });
        if (!fila) return null;

        const perfilId =
            fila.rol === 'administrador'
                ? fila.administrador?.id
                : fila.cliente?.id;
        if (perfilId === undefined) {
            throw new Error(`El usuario ${fila.id} no tiene un perfil asociado a su rol.`);
        }

        return {
            usuarioId: fila.id,
            perfilId,
            email: fila.email,
            passwordHash: fila.passwordHash,
            rol: fila.rol as Rol,
            creadoEn: fila.creadoEn,
        };
    }

    async registrarCliente(nuevo: NuevoUsuario, nuevaDireccion: Omit<Direccion, "id">): Promise<UsuarioAutenticado> {
        const fila = await this.prisma.cliente.create({
            data: {
                nombre: nuevo.nombre,
                telefono: nuevo.telefono,
                usuario: {
                    create: {
                        email: nuevo.email.toLowerCase(),
                        passwordHash: nuevo.passwordHash,
                        rol: "cliente"
                    }
                },
                direccion: {
                    create: {
                        calle: nuevaDireccion.calle,
                        colonia: nuevaDireccion.colonia,
                        numero: nuevaDireccion.numero
                    }
                }
            }, include: {
                direccion: true,
                usuario: true
            }
        });
        return {
            usuarioId: fila.usuario.id,
            perfilId: fila.id,
            email: fila.usuario.email,
            passwordHash: fila.usuario.passwordHash,
            rol: fila.usuario.rol as Rol,
            creadoEn: fila.usuario.creadoEn,
        };
    }
}