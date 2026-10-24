import { Injectable } from '@nestjs/common';
import { Prisma } from '../../generado/prisma/client';
import { Rol, type Administrador } from 'src/dominio/entidades';
import {
  AdministradorConRegistrosError,
  EmailYaRegistradoError,
} from 'src/dominio/errores';
import { PrismaService } from 'src/prisma/prisma.service';
import type { AdminRepository } from '../repositorios/admin.repository';

const ADMINISTRADOR_CON_USUARIO = {
  usuario: true,
} satisfies Prisma.AdministradorInclude;

type AdministradorConUsuario = Prisma.AdministradorGetPayload<{
  include: typeof ADMINISTRADOR_CON_USUARIO;
}>;

function aAdministradorDominio(
  administrador: AdministradorConUsuario,
): Administrador {
  return {
    id: administrador.id,
    email: administrador.usuario.email,
    passwordHash: administrador.usuario.passwordHash,
    rol:
      administrador.usuario.rol === 'administrador'
        ? Rol.administrador
        : Rol.cliente,
    creadoEn: administrador.usuario.creadoEn,
    nombre: administrador.nombre,
    telefono: administrador.telefono ?? undefined,
  };
}

function esErrorPrisma(error: unknown, codigo: string): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === codigo
  );
}

@Injectable()
export class AdminPrismaRepository implements AdminRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listar(): Promise<Administrador[]> {
    const administradores = await this.prisma.administrador.findMany({
      include: ADMINISTRADOR_CON_USUARIO,
      orderBy: { id: 'asc' },
    });
    return administradores.map(aAdministradorDominio);
  }

  async buscarPorId(id: number): Promise<Administrador | null> {
    const administrador = await this.prisma.administrador.findUnique({
      where: { id },
      include: ADMINISTRADOR_CON_USUARIO,
    });
    return administrador ? aAdministradorDominio(administrador) : null;
  }

  async buscarPorEmail(email: string): Promise<Administrador | null> {
    const administrador = await this.prisma.administrador.findFirst({
      where: { usuario: { email: email.toLowerCase() } },
      include: ADMINISTRADOR_CON_USUARIO,
    });
    return administrador ? aAdministradorDominio(administrador) : null;
  }

  async crear(datos: Omit<Administrador, 'id'>): Promise<Administrador> {
    try {
      const administrador = await this.prisma.administrador.create({
        data: {
          nombre: datos.nombre,
          telefono: datos.telefono,
          usuario: {
            create: {
              email: datos.email.toLowerCase(),
              passwordHash: datos.passwordHash,
              rol: 'administrador',
            },
          },
        },
        include: ADMINISTRADOR_CON_USUARIO,
      });
      return aAdministradorDominio(administrador);
    } catch (error) {
      if (esErrorPrisma(error, 'P2002')) {
        throw new EmailYaRegistradoError(datos.email);
      }
      throw error;
    }
  }

  async actualizar(
    id: number,
    datos: Partial<Administrador>,
  ): Promise<Administrador | null> {
    return this.prisma
      .$transaction(async (transaccion) => {
        const existente = await transaccion.administrador.findUnique({
          where: { id },
          include: ADMINISTRADOR_CON_USUARIO,
        });
        if (!existente) return null;

        const datosAdministrador: Prisma.AdministradorUpdateInput = {};
        if (datos.nombre !== undefined) {
          datosAdministrador.nombre = datos.nombre;
        }
        if (datos.telefono !== undefined) {
          datosAdministrador.telefono = datos.telefono;
        }
        if (Object.keys(datosAdministrador).length > 0) {
          await transaccion.administrador.update({
            where: { id },
            data: datosAdministrador,
          });
        }

        const datosUsuario: Prisma.UsuarioUpdateInput = {};
        if (datos.email !== undefined) {
          datosUsuario.email = datos.email.toLowerCase();
        }
        if (datos.passwordHash !== undefined) {
          datosUsuario.passwordHash = datos.passwordHash;
        }
        if (Object.keys(datosUsuario).length > 0) {
          await transaccion.usuario.update({
            where: { id: existente.usuarioId },
            data: datosUsuario,
          });
        }

        const actualizado = await transaccion.administrador.findUnique({
          where: { id },
          include: ADMINISTRADOR_CON_USUARIO,
        });
        return actualizado ? aAdministradorDominio(actualizado) : null;
      })
      .catch((error: unknown) => {
        if (esErrorPrisma(error, 'P2002')) {
          throw new EmailYaRegistradoError(datos.email);
        }
        throw error;
      });
  }

  async eliminar(id: number): Promise<Administrador | null> {
    try {
      return await this.prisma.$transaction(async (transaccion) => {
        const administrador = await transaccion.administrador.findUnique({
          where: { id },
          include: ADMINISTRADOR_CON_USUARIO,
        });
        if (!administrador) return null;

        await transaccion.administrador.delete({ where: { id } });
        await transaccion.usuario.delete({
          where: { id: administrador.usuarioId },
        });
        return aAdministradorDominio(administrador);
      });
    } catch (error) {
      if (esErrorPrisma(error, 'P2003')) {
        throw new AdministradorConRegistrosError(id);
      }
      throw error;
    }
  }
}
