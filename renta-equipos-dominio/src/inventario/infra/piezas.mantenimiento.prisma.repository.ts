import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../generated/prisma/client';
import type {
  FiltrosMantenimiento,
  PiezasMantenimiento,
} from 'src/dominio/entidades';
import { PrismaService } from 'src/prisma/prisma.service';
import type { PiezasMantenimientoRepository } from '../repositorios/piezas.mantenimiento.repository';

@Injectable()
export class PiezasMantenimientoPrismaRepository
  implements PiezasMantenimientoRepository
{
  constructor(private readonly prisma: PrismaService) {}

  listar(): Promise<PiezasMantenimiento[]> {
    return this.prisma.piezasMantenimiento.findMany({
      orderBy: { id: 'asc' },
    });
  }

  buscarPorId(id: number): Promise<PiezasMantenimiento | null> {
    return this.prisma.piezasMantenimiento.findUnique({ where: { id } });
  }

  busquedaFiltrada(
    filtros: FiltrosMantenimiento,
  ): Promise<PiezasMantenimiento[]> {
    const where: Prisma.PiezasMantenimientoWhereInput = {};
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
    if (filtros.fechaInicio !== undefined) {
      where.fechaInicio = { gte: filtros.fechaInicio };
    }
    if (filtros.fechaTermino !== undefined) {
      where.fechaTermino = { lte: filtros.fechaTermino };
    }
    if (filtros.motivo !== undefined) where.motivo = filtros.motivo;

    return this.prisma.piezasMantenimiento.findMany({
      where,
      orderBy: { id: 'asc' },
    });
  }

  crear(datos: Omit<PiezasMantenimiento, 'id'>): Promise<PiezasMantenimiento> {
    return this.prisma.piezasMantenimiento.create({ data: datos });
  }
}
