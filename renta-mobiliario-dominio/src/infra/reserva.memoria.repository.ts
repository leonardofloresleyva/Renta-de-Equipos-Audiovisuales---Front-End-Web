import { Injectable } from '@nestjs/common';
import { nuevoFolio, type ArticuloReserva, type Direccion, type NuevaReserva, type NuevoArticuloReserva, type Reserva } from '../dominio/entidades';
import type { ReservaRepository } from '../dominio/reserva.repository';

@Injectable()
export class ReservaMemoriaRepository implements ReservaRepository {
  private reservas = new Map<number, Reserva>([
    [
      1,
      {
        id: 1,
        clienteId: 1,
        folio: nuevoFolio(),
        montoTotal: 4600,
        fechaEntrega: new Date('2026-10-10'),
        fechaRecoleccion: new Date('2026-10-12'),
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
        folio: nuevoFolio(),
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

  private articuloReservas = new Map<number, ArticuloReserva>([[1, 
    {
      id: 1,
      articuloId: 1,
      reservaId: 1,
      cantidad: 4,
      precioUnitario: 125.00,
      subtotal: 500.00
    }],[2,
      {
      id: 2,
      articuloId: 2,
      reservaId: 1,
      cantidad: 21,
      precioUnitario: 13.50,
      subtotal: 283.50
    }],[3, 
    {
      id: 3,
      articuloId: 4,
      reservaId: 1,
      cantidad: 6,
      precioUnitario: 76.25,
      subtotal: 457.50
    }],[4, 
    {
      id: 4,
      articuloId: 1,
      reservaId: 2,
      cantidad: 2,
      precioUnitario: 125.00,
      subtotal: 500.00
    }], [5, 
    {
      id: 5,
      articuloId: 3,
      reservaId: 2,
      cantidad: 13,
      precioUnitario: 44.75,
      subtotal: 581.75
  }]]);

  private proximoIdArticulos = 6;

  private direccionesEntrega = new Map<number, Direccion>();
  private proximoIdDireccion = 0;

  async listar(): Promise<Reserva[]> {
    return Array.from(this.reservas.values());
  }

  async buscarPorId(id: number): Promise<Reserva | null> {
    const reserva = this.reservas.get(Number(id));
    if (!reserva) return null;
    return reserva;
  }

  async buscarPorCliente(clienteId: number): Promise<Reserva[]> {
    return Array.from(this.reservas.values()).filter((r) => r.clienteId === clienteId);
  }

  async buscarArticulosPorId(id: number): Promise<ArticuloReserva[]> {
    return Array.from(this.articuloReservas.values()).filter((a) => a.reservaId === id);
  }

  async crear(datosReserva: NuevaReserva, datosArticulos: NuevoArticuloReserva[]): Promise<Reserva> {
    // Se contruye y se guarda la nueva dirección de entrega
    const direccionEntrega: Direccion = {
      id: this.proximoIdDireccion++,
      numero: datosReserva.numero,
      calle: datosReserva.calle,
      colonia: datosReserva.colonia
    };
    this.direccionesEntrega.set(direccionEntrega.id, direccionEntrega);
    // Se contruye la nueva reserva
    const id = this.proximoId++;
    const nuevaReserva: Reserva = {
      id,
      clienteId: datosReserva.clienteId,
      folio: datosReserva.folio,
      montoTotal: datosReserva.montoTotal,
      fechaEntrega: datosReserva.fechaEntrega,
      fechaRecoleccion: datosReserva.fechaRecoleccion,
      creadoEn: new Date(),
      estado: 'apartada',
      direccionEntrega: direccionEntrega
    };
    // Se contruyen y se guardan los artículos reservados
    datosArticulos.forEach((a) => {
      const id = this.proximoIdArticulos++;
      const nuevoArticuloReserva = {
        id,
        articuloId: a.articuloId,
        reservaId: nuevaReserva.id,
        cantidad: a.cantidad,
        precioUnitario: a.precioUnitario,
        subtotal: a.subtotal
      };
      this.articuloReservas.set(id, nuevoArticuloReserva);
    });
    // Finalmente, se guarda la nueva reserva
    this.reservas.set(id, nuevaReserva);
    return nuevaReserva;
  }

  async actualizar(id: number, datos: Partial<Reserva>): Promise<Reserva | null> {
    const reservaExistente = this.reservas.get(id);
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
    this.reservas.set(id, reservaActualizada);
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
    reserva.estado = 'cancelada';
    this.reservas.set(reserva.id, reserva);
    return reserva;
  }

  async obtenerPiezasReservadas(articuloId: number, fechaInicio: Date, fechaFin: Date): Promise<number> {
    let piezasReservadas = 0;
    const reservados = [...this.articuloReservas.values()]
      .filter((a) => a.articuloId === articuloId && 
      (
        (
          fechaInicio >= (this.reservas.get(a.reservaId)?.fechaEntrega ?? new Date()) ||
          fechaInicio <= (this.reservas.get(a.reservaId)?.fechaRecoleccion ?? new Date())
        ) || 
        (
          fechaFin >= (this.reservas.get(a.reservaId)?.fechaEntrega ?? new Date()) ||
          fechaFin <= (this.reservas.get(a.reservaId)?.fechaRecoleccion ?? new Date())
        )
      ));
      reservados.forEach((a) => piezasReservadas += a.cantidad);
      return piezasReservadas;
  }
}
