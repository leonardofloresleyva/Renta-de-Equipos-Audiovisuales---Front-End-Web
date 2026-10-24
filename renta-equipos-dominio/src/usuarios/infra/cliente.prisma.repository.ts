import { Injectable } from '@nestjs/common';
import { Prisma } from '../../generado/prisma/client';
import { Cliente, Direccion, NuevoUsuario, Rol } from 'src/dominio/entidades';
import {
  ClienteConRegistrosError,
  EmailYaRegistradoError,
} from 'src/dominio/errores';
import { PrismaService } from 'src/prisma/prisma.service';
import type { ClienteRepository } from '../repositorios/cliente.repository';

const CLIENTE_CON_RELACIONES = {
  usuario: true,
  direccion: true,
} satisfies Prisma.ClienteInclude;

type ClienteConRelaciones = Prisma.ClienteGetPayload<{
  include: typeof CLIENTE_CON_RELACIONES;
}>;

function aClienteDominio(cliente: ClienteConRelaciones): Cliente {
  return {
    id: cliente.id,
    email: cliente.usuario.email,
    passwordHash: cliente.usuario.passwordHash,
    rol:
      cliente.usuario.rol === 'administrador' ? Rol.administrador : Rol.cliente,
    creadoEn: cliente.usuario.creadoEn,
    nombre: cliente.nombre,
    telefono: cliente.telefono,
    direccion: {
      id: cliente.direccion.id,
      numero: cliente.direccion.numero,
      calle: cliente.direccion.calle,
      colonia: cliente.direccion.colonia,
    },
  };
}

function esErrorPrisma(error: unknown, codigo: string): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === codigo
  );
}

@Injectable()
export class ClientePrismaRepository implements ClienteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listar(): Promise<Cliente[]> {
    const clientes = await this.prisma.cliente.findMany({
      include: CLIENTE_CON_RELACIONES,
      orderBy: { id: 'asc' },
    });
    return clientes.map(aClienteDominio);
  }

  async buscarPorId(id: number): Promise<Cliente | null> {
    const cliente = await this.prisma.cliente.findUnique({
      where: { id },
      include: CLIENTE_CON_RELACIONES,
    });
    return cliente ? aClienteDominio(cliente) : null;
  }

  async buscarPorEmail(email: string): Promise<Cliente | null> {
    const cliente = await this.prisma.cliente.findFirst({
      where: { usuario: { email: email.toLowerCase() } },
      include: CLIENTE_CON_RELACIONES,
    });
    return cliente ? aClienteDominio(cliente) : null;
  }

  async crear(
    nuevo: NuevoUsuario,
    nuevaDireccion: Omit<Direccion, 'id'>,
  ): Promise<Cliente> {
    try {
      const cliente = await this.prisma.cliente.create({
        data: {
          nombre: nuevo.nombre,
          telefono: nuevo.telefono,
          usuario: {
            create: {
              email: nuevo.email.toLowerCase(),
              passwordHash: nuevo.passwordHash,
              rol: 'cliente',
            },
          },
          direccion: {
            create: {
              numero: nuevaDireccion.numero,
              calle: nuevaDireccion.calle,
              colonia: nuevaDireccion.colonia,
            },
          },
        },
        include: CLIENTE_CON_RELACIONES,
      });
      return aClienteDominio(cliente);
    } catch (error) {
      if (esErrorPrisma(error, 'P2002')) {
        throw new EmailYaRegistradoError(nuevo.email);
      }
      throw error;
    }
  }

  actualizar(id: number, datos: Partial<Cliente>): Promise<Cliente | null> {
    return this.prisma
      .$transaction(async (transaccion) => {
        const existente = await transaccion.cliente.findUnique({
          where: { id },
          include: CLIENTE_CON_RELACIONES,
        });
        if (!existente) return null;

        const datosCliente: Prisma.ClienteUpdateInput = {};
        if (datos.nombre !== undefined) datosCliente.nombre = datos.nombre;
        if (datos.telefono !== undefined) {
          datosCliente.telefono = datos.telefono;
        }
        if (datos.direccion !== undefined) {
          datosCliente.direccion = {
            update: {
              numero: datos.direccion.numero,
              calle: datos.direccion.calle,
              colonia: datos.direccion.colonia,
            },
          };
        }

        if (Object.keys(datosCliente).length > 0) {
          await transaccion.cliente.update({
            where: { id },
            data: datosCliente,
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

        const actualizado = await transaccion.cliente.findUnique({
          where: { id },
          include: CLIENTE_CON_RELACIONES,
        });
        return actualizado ? aClienteDominio(actualizado) : null;
      })
      .catch((error: unknown) => {
        if (esErrorPrisma(error, 'P2002')) {
          throw new EmailYaRegistradoError(datos.email);
        }
        throw error;
      });
  }

  async eliminar(id: number): Promise<Cliente | null> {
    try {
      return await this.prisma.$transaction(async (transaccion) => {
        const cliente = await transaccion.cliente.findUnique({
          where: { id },
          include: CLIENTE_CON_RELACIONES,
        });
        if (!cliente) return null;

        await transaccion.cliente.delete({ where: { id } });
        await transaccion.direccion.delete({
          where: { id: cliente.direccionId },
        });
        await transaccion.usuario.delete({
          where: { id: cliente.usuarioId },
        });

        return aClienteDominio(cliente);
      });
    } catch (error) {
      if (esErrorPrisma(error, 'P2003')) {
        throw new ClienteConRegistrosError(id);
      }
      throw error;
    }
  }
}
