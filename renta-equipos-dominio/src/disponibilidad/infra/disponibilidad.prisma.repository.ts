import { Injectable } from '@nestjs/common';
import { ARTICULOS_RESERVA, RESERVAS } from 'src/datos/renta.equipo.seed';
import { PrismaService } from 'src/prisma/prisma.service';
import type { DisponibilidadRepository } from '../repo/disponibilidad.repository';

@Injectable()
export class DisponibilidadPrismaRepository
  implements DisponibilidadRepository {
  constructor(private readonly prisma: PrismaService) { }

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
    const resultado = await this.prisma.articuloReserva.aggregate({
      _sum: {
        cantidad: true
      }, where: {
        articuloId: articuloId,
        reserva: {
          estado: "apartada"
        }
      }
    });
    return resultado._sum.cantidad ?? 0;
  }

  async obtenerPiezasReservadasPeriodo(
    articuloId: number,
    fechaInicio: Date,
    fechaFin: Date,
  ): Promise<number> {
    const resultado = await this.prisma.articuloReserva.aggregate({
      _sum: {
        cantidad: true
      },
      where: {
        articuloId: articuloId,
        reserva: {
          estado: "apartada"
        },
        OR: [
          {
            AND: [{ reserva: { fechaEntrega: { lt: fechaInicio } } }, { reserva: { fechaRecoleccion: { gt: fechaInicio } } }]
          },
          {
            AND: [{ reserva: { fechaEntrega: { lt: fechaFin } } }, { reserva: { fechaRecoleccion: { gt: fechaFin } } }]
          }
        ]
      }
    });
    return resultado._sum.cantidad ?? 0;
  }
}
