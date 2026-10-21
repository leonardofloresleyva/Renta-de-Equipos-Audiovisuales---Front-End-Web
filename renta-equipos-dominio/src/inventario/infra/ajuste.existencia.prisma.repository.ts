import { Injectable } from '@nestjs/common';
import { Prisma } from '../../generado/prisma/client';
import type {
  AjusteExistencia,
  FiltrosAjusteExistencia,
  NuevoAjusteExistencia,
} from 'src/dominio/entidades';
import { ExistenciasModificadasConcurrentementeError } from 'src/dominio/errores';
import { PrismaService } from 'src/prisma/prisma.service';
import type { AjusteExistenciaRepository } from '../repositorios/ajuste.existencia.repository';

@Injectable()
export class AjusteExistenciaPrismaRepository
  implements AjusteExistenciaRepository
{
  constructor(private readonly prisma: PrismaService) {}

  listar(): Promise<AjusteExistencia[]> {
    return this.prisma.ajusteExistencia.findMany({ orderBy: { id: 'asc' } });
  }

  buscarPorId(id: number): Promise<AjusteExistencia | null> {
    return this.prisma.ajusteExistencia.findUnique({ where: { id } });
  }

  busquedaFiltrada(
    filtros: FiltrosAjusteExistencia,
  ): Promise<AjusteExistencia[]> {
    const where: Prisma.AjusteExistenciaWhereInput = {};
    if (filtros.articuloId !== undefined) {
      where.articuloId = filtros.articuloId;
    }
    if (filtros.adminId !== undefined) where.adminId = filtros.adminId;
    if (
      filtros.cantidadMinima !== undefined ||
      filtros.cantidadMaxima !== undefined
    ) {
      where.cantidad = {
        ...(filtros.cantidadMinima !== undefined
          ? { gte: filtros.cantidadMinima }
          : {}),
        ...(filtros.cantidadMaxima !== undefined
          ? { lte: filtros.cantidadMaxima }
          : {}),
      };
    }
    if (filtros.esIncremento !== undefined) {
      where.esIncremento = filtros.esIncremento;
    }
    if (filtros.motivo !== undefined) where.motivo = filtros.motivo;

    return this.prisma.ajusteExistencia.findMany({
      where,
      orderBy: { id: 'asc' },
    });
  }

  crear(datos: NuevoAjusteExistencia): Promise<AjusteExistencia> {
    return this.prisma.ajusteExistencia.create({ data: datos });
  }

  crearConActualizacionExistencias(
    datos: NuevoAjusteExistencia,
    existenciasActuales: number,
    existenciasNuevas: number,
  ): Promise<AjusteExistencia> {
    return this.prisma.$transaction(async (transaccion) => {
      const actualizacion = await transaccion.articulo.updateMany({
        where: {
          id: datos.articuloId,
          existencias: existenciasActuales,
        },
        data: { existencias: existenciasNuevas },
      });

      if (actualizacion.count !== 1) {
        throw new ExistenciasModificadasConcurrentementeError();
      }

      return transaccion.ajusteExistencia.create({ data: datos });
    });
  }
}
