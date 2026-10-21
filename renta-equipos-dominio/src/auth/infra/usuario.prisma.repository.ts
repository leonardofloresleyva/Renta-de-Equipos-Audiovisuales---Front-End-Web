import { Injectable } from '@nestjs/common';
import { PrismaService } from "src/prisma/prisma.service";
import { UsuarioRepository } from "../repo/usuario.repository";
import { Cliente, Direccion, NuevoUsuario, Rol, Usuario } from "src/dominio/entidades";

@Injectable()
export class UsuarioPrismaRepository implements UsuarioRepository {
    constructor(private readonly prisma: PrismaService) { }

    async buscarPorCorreo(correo: string): Promise<Usuario | null> {
        const fila = await this.prisma.usuario.findUnique({
            where: { email: correo.toLowerCase() }
        });
        return fila ? { ...fila, rol: fila.rol as Rol } : null;
    }

    async registrarCliente(nuevo: NuevoUsuario, nuevaDireccion: Omit<Direccion, "id">): Promise<Cliente> {
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
            id: fila.id,
            email: fila.usuario.email,
            passwordHash: fila.usuario.passwordHash,
            rol: fila.usuario.rol as Rol,
            creadoEn: fila.usuario.creadoEn,
            nombre: fila.nombre,
            telefono: fila.telefono,
            direccion: fila.direccion,
        };
    }
}