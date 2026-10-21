import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../generated/prisma/client';
import type { Articulo, FiltrosArticulo } from 'src/dominio/entidades';
import { PrismaService } from 'src/prisma/prisma.service';
import type { ArticuloRepository } from '../repositorios/articulo.repository';

const ARTICULO_CON_FOTOGRAFIAS = {
  fotografias: { orderBy: { orden: 'asc' } },
} satisfies Prisma.ArticuloInclude;

type ArticuloConFotografias = Prisma.ArticuloGetPayload<{
  include: typeof ARTICULO_CON_FOTOGRAFIAS;
}>;

function aArticuloDominio(articulo: ArticuloConFotografias): Articulo {
  return {
    id: articulo.id,
    nombre: articulo.nombre,
    descripcion: articulo.descripcion,
    precioPorDia: Number(articulo.precioPorDia),
    existencias: articulo.existencias,
    categoria: articulo.categoria,
    fotografiasUrl: articulo.fotografias.map((fotografia) => fotografia.url),
  };
}

@Injectable()
export class ArticuloPrismaRepository implements ArticuloRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listar(): Promise<Articulo[]> {
    const articulos = await this.prisma.articulo.findMany({
      include: ARTICULO_CON_FOTOGRAFIAS,
      orderBy: { id: 'asc' },
    });
    return articulos.map(aArticuloDominio);
  }

  async buscarPorId(id: number): Promise<Articulo | null> {
    const articulo = await this.prisma.articulo.findUnique({
      where: { id },
      include: ARTICULO_CON_FOTOGRAFIAS,
    });
    return articulo ? aArticuloDominio(articulo) : null;
  }

  async busquedaFiltrada(filtros: FiltrosArticulo): Promise<Articulo[]> {
    const where: Prisma.ArticuloWhereInput = {};

    if (filtros.nombre) where.nombre = { contains: filtros.nombre };
    if (filtros.descripcion) {
      where.descripcion = { contains: filtros.descripcion };
    }
    if (filtros.categoria) where.categoria = filtros.categoria;
    if (
      filtros.precioMinimo !== undefined ||
      filtros.precioMaximo !== undefined
    ) {
      where.precioPorDia = {
        ...(filtros.precioMinimo !== undefined
          ? { gte: filtros.precioMinimo }
          : {}),
        ...(filtros.precioMaximo !== undefined
          ? { lte: filtros.precioMaximo }
          : {}),
      };
    }

    const articulos = await this.prisma.articulo.findMany({
      where,
      include: ARTICULO_CON_FOTOGRAFIAS,
      orderBy: { id: 'asc' },
    });
    return articulos.map(aArticuloDominio);
  }

  async crear(datos: Omit<Articulo, 'id'>): Promise<Articulo> {
    const articulo = await this.prisma.articulo.create({
      data: {
        nombre: datos.nombre,
        descripcion: datos.descripcion,
        precioPorDia: datos.precioPorDia,
        existencias: datos.existencias,
        categoria: datos.categoria,
        fotografias: {
          create: datos.fotografiasUrl.map((url, orden) => ({ url, orden })),
        },
      },
      include: ARTICULO_CON_FOTOGRAFIAS,
    });
    return aArticuloDominio(articulo);
  }

  async actualizar(
    id: number,
    datos: Partial<Articulo>,
  ): Promise<Articulo | null> {
    return this.prisma.$transaction(async (transaccion) => {
      const existente = await transaccion.articulo.findUnique({
        where: { id },
      });
      if (!existente) return null;

      const datosActualizacion: Prisma.ArticuloUpdateInput = {};
      if (datos.nombre !== undefined) {
        datosActualizacion.nombre = datos.nombre;
      }
      if (datos.descripcion !== undefined) {
        datosActualizacion.descripcion = datos.descripcion;
      }
      if (datos.precioPorDia !== undefined) {
        datosActualizacion.precioPorDia = datos.precioPorDia;
      }
      if (datos.existencias !== undefined) {
        datosActualizacion.existencias = datos.existencias;
      }
      if (datos.categoria !== undefined) {
        datosActualizacion.categoria = datos.categoria;
      }
      if (datos.fotografiasUrl !== undefined) {
        datosActualizacion.fotografias = {
          deleteMany: {},
          create: datos.fotografiasUrl.map((url, orden) => ({ url, orden })),
        };
      }

      const actualizado = await transaccion.articulo.update({
        where: { id },
        data: datosActualizacion,
        include: ARTICULO_CON_FOTOGRAFIAS,
      });
      return aArticuloDominio(actualizado);
    });
  }

  async eliminar(id: number): Promise<Articulo | null> {
    return this.prisma.$transaction(async (transaccion) => {
      const articulo = await transaccion.articulo.findUnique({
        where: { id },
        include: ARTICULO_CON_FOTOGRAFIAS,
      });
      if (!articulo) return null;

      await transaccion.articulo.delete({ where: { id } });
      return aArticuloDominio(articulo);
    });
  }
}
