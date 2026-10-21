import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../generated/prisma/client';
import { BitacoraReserva, NuevoInspeccionPieza } from 'src/dominio/entidades';
import { PrismaService } from 'src/prisma/prisma.service';
import { BitacoraReservaRepository } from '../repositorios/bitacora.reserva.repository';

type BitacoraPrisma = Prisma.BitacoraReservaGetPayload<object>;

function aDominio(bitacora: BitacoraPrisma): BitacoraReserva {
  return {
    id: bitacora.id,
    reservaId: bitacora.reservaId,
    fechaHoraEntregada: bitacora.fechaHoraEntregada,
    fechaHoraRecolectada: bitacora.fechaHoraRecolectada ?? undefined,
    montoTotalGarantía: Number(bitacora.montoTotalGarantia),
  };
}

@Injectable()
export class BitacoraReservaPrismaRepository implements BitacoraReservaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listar(): Promise<BitacoraReserva[]> {
    const bitacoras = await this.prisma.bitacoraReserva.findMany({
      orderBy: { id: 'asc' },
    });
    return bitacoras.map(aDominio);
  }

  async buscarPorId(id: number): Promise<BitacoraReserva | null> {
    const bitacora = await this.prisma.bitacoraReserva.findUnique({
      where: { id },
    });
    return bitacora ? aDominio(bitacora) : null;
  }

  async buscarPorReserva(idReserva: number): Promise<BitacoraReserva | null> {
    const bitacora = await this.prisma.bitacoraReserva.findUnique({
      where: { reservaId: idReserva },
    });
    return bitacora ? aDominio(bitacora) : null;
  }

  async entregar(
    datos: Omit<
      BitacoraReserva,
      'id' | 'fechaHoraEntregada' | 'fechaHoraRecolectada'
    >,
  ): Promise<BitacoraReserva> {
    const bitacora = await this.prisma.bitacoraReserva.create({
      data: {
        reservaId: datos.reservaId,
        montoTotalGarantia: datos.montoTotalGarantía,
      },
    });
    return aDominio(bitacora);
  }

  async recolectar(
    id: number,
    inspeccionesPiezas: NuevoInspeccionPieza[],
  ): Promise<BitacoraReserva | null> {
    return this.prisma.$transaction(async (transaction) => {
      const actualizacion = await transaction.bitacoraReserva.updateMany({
        where: { id, fechaHoraRecolectada: null },
        data: { fechaHoraRecolectada: new Date() },
      });
      if (actualizacion.count === 0) return null;

      if (inspeccionesPiezas.length > 0) {
        await transaction.inspeccionPieza.createMany({
          data: inspeccionesPiezas.map((inspeccion) => ({
            articuloReservadoId: inspeccion.articuloReservadoId,
            bitacoraReservaId: id,
            piezasCompletas: inspeccion.piezasCompletas,
            piezasDaniadas: inspeccion.piezasDaniadas,
            piezasFaltantes: inspeccion.piezasFaltantes,
            montoGarantia: inspeccion.montoGarantia,
          })),
        });
      }

      const bitacora = await transaction.bitacoraReserva.findUniqueOrThrow({
        where: { id },
      });
      return aDominio(bitacora);
    });
  }
}
