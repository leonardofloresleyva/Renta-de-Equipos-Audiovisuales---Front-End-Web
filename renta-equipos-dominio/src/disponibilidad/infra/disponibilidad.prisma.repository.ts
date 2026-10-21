import { Injectable } from '@nestjs/common';
import { ARTICULOS_RESERVA, RESERVAS } from 'src/datos/renta.equipo.seed';
import { PrismaService } from 'src/prisma/prisma.service';
import type { DisponibilidadRepository } from '../repo/disponibilidad.repository';

@Injectable()
export class DisponibilidadPrismaRepository
  implements DisponibilidadRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async obtenerExistenciasArticulo(id: number): Promise<number | null> {
    const articulo = await this.prisma.articulo.findUnique({
      where: { id },
      select: { existencias: true },
    });
    return articulo?.existencias ?? null;
  }

  async obtenerPiezasMantenimiento(articuloId: number): Promise<number> {
    const resultado = await this.prisma.piezasMantenimiento.aggregate({
      where: { articuloId },
      _sum: { cantidad: true },
    });
    return resultado._sum.cantidad ?? 0;
  }

  async obtenerPiezasMantenimientoPeriodo(
    articuloId: number,
    fechaInicio: Date,
    fechaFin: Date,
  ): Promise<number> {
    const resultado = await this.prisma.piezasMantenimiento.aggregate({
      where: {
        articuloId,
        fechaInicio: { lte: fechaFin },
        fechaTermino: { gte: fechaInicio },
      },
      _sum: { cantidad: true },
    });
    return resultado._sum.cantidad ?? 0;
  }

  async obtenerPiezasReservadas(articuloId: number): Promise<number> {
    return [...ARTICULOS_RESERVA.values()]
      .filter((articuloReservado) => {
        if (articuloReservado.articuloId !== articuloId) return false;
        const reserva = RESERVAS.get(articuloReservado.reservaId);
        return reserva?.estado === 'apartada' || reserva?.estado === 'entregada';
      })
      .reduce(
        (total, articuloReservado) => total + articuloReservado.cantidad,
        0,
      );
  }

  async obtenerPiezasReservadasPeriodo(
    articuloId: number,
    fechaInicio: Date,
    fechaFin: Date,
  ): Promise<number> {
    return [...ARTICULOS_RESERVA.values()]
      .filter((articuloReservado) => {
        if (articuloReservado.articuloId !== articuloId) return false;
        const reserva = RESERVAS.get(articuloReservado.reservaId);
        if (reserva?.estado !== 'apartada' && reserva?.estado !== 'entregada') {
          return false;
        }

        return (
          fechaInicio <= reserva.fechaRecoleccion &&
          fechaFin >= reserva.fechaEntrega
        );
      })
      .reduce(
        (total, articuloReservado) => total + articuloReservado.cantidad,
        0,
      );
  }
}
