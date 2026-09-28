import { Injectable } from '@nestjs/common';
import type { Reserva } from '../dominio/entidades';
import type { ReservaRepository } from '../dominio/reserva.repository';

@Injectable()
export class ReservaMemoriaRepository implements ReservaRepository {
  private reservas = new Map<number, Reserva>([
    [
      1,
      {
        id: 1,
        clienteId: 1,
        folio: 1001,
        montoTotal: 4600,
        fechaEntrega: new Date('2026-10-10T10:00:00Z'),
        fechaRecoleccion: new Date('2026-10-12T18:00:00Z'),
        creadoEn: new Date('2026-09-20T14:30:00Z'),
        estado: 'apartada',
        direccionEntrega: {
          id: 101,
          numero: '450',
          calle: 'Av. Miguel Alemán',
          colonia: 'Centro',
        },
      },
    ],
    [
      2,
      {
        id: 2,
        clienteId: 2,
        folio: 1002,
        montoTotal: 2550,
        fechaEntrega: new Date('2026-09-15T09:00:00Z'),
        fechaRecoleccion: new Date('2026-09-17T20:00:00Z'),
        creadoEn: new Date('2026-09-10T11:00:00Z'),
        estado: 'entregada',
        direccionEntrega: {
          id: 102,
          numero: '1280-B',
          calle: 'Blvd. Rodolfo Elías Calles',
          colonia: 'Náinari del Yaqui',
        },
      },
    ],
  ]);

  private proximoId = 3;

  async listar(): Promise<Reserva[]> {
    return Array.from(this.reservas.values()).map((r) => ({
      ...r,
      direccionEntrega: { ...r.direccionEntrega },
    }));
  }

  async buscarPorId(id: number): Promise<Reserva | null> {
    const reserva = this.reservas.get(Number(id));
    if (!reserva) return null;
    return {
      ...reserva,
      direccionEntrega: { ...reserva.direccionEntrega },
    };
  }

  async buscarPorCliente(clienteId: number): Promise<Reserva[]> {
    return Array.from(this.reservas.values())
      .filter((r) => r.clienteId === Number(clienteId))
      .map((r) => ({
        ...r,
        direccionEntrega: { ...r.direccionEntrega },
      }));
  }

  async crear(datos: Omit<Reserva, 'id'>): Promise<Reserva> {
    const id = this.proximoId++;
    const nuevaReserva: Reserva = {
      id,
      ...datos,
      direccionEntrega: { ...datos.direccionEntrega },
    };
    this.reservas.set(id, nuevaReserva);
    return {
      ...nuevaReserva,
      direccionEntrega: { ...nuevaReserva.direccionEntrega },
    };
  }

  async actualizar(id: number, datos: Partial<Reserva>): Promise<Reserva | null> {
    const reservaExistente = this.reservas.get(Number(id));
    if (!reservaExistente) {
      return null;
    }
    const reservaActualizada: Reserva = {
      ...reservaExistente,
      ...datos,
      id: reservaExistente.id,
      direccionEntrega: datos.direccionEntrega
        ? { ...reservaExistente.direccionEntrega, ...datos.direccionEntrega }
        : reservaExistente.direccionEntrega,
    };
    this.reservas.set(Number(id), reservaActualizada);
    return {
      ...reservaActualizada,
      direccionEntrega: { ...reservaActualizada.direccionEntrega },
    };
  }

  async eliminar(id: number): Promise<Reserva | null> {
    const reserva = this.reservas.get(Number(id));
    if (!reserva) {
      return null;
    }
    this.reservas.delete(Number(id));
    return {
      ...reserva,
      direccionEntrega: { ...reserva.direccionEntrega },
    };
  }
}
