import { Injectable } from '@nestjs/common';
import type { AdminRepository } from '../dominio/admin.repository';
import type { Administrador, AjusteExistencia, BitacoraReserva, InspeccionPieza, NuevoAjusteExistencia, NuevoInspeccionPieza, PiezasMantenimiento, RegistroEntradaBitacora } from '../dominio/entidades';

@Injectable()
export class AdminMemoriaRepository implements AdminRepository {
  private administradores = new Map<number, Administrador>([
    [
      1,
      {
        id: 1,
        email: 'admin.general@audiorent.mx',
        password: 'passwordSeguro123!',
        nombre: 'Carlos Mendoza Ramos',
        telefono: '6441234567',
      },
    ],
    [
      2,
      {
        id: 2,
        email: 'almacen.audiovisual@audiorent.mx',
        password: 'passwordSeguro456!',
        nombre: 'Valeria Gómez Peña',
        telefono: '6449876543',
      },
    ],
  ]);

  private proximoId = 3;

  private piezasMantenimiento = new Map<number, PiezasMantenimiento>([
    [
      1, {
        id: 1,
        articuloId: 1,
        adminId: 1,
        cantidad: 2,
        fechaInicio: new Date('2026-09-29'),
        fechaTermino: new Date('2026-10-01'),
        motivo: 'limpieza'
      }],
    [
      2, {
        id: 2,
        articuloId: 2,
        adminId: 2,
        cantidad: 8,
        fechaInicio: new Date('2026-10-05'),
        fechaTermino: new Date('2026-10-09'),
        motivo: 'reparacion'
      }]
  ]);
  private proximoMantenimientoId = 3;

  private ajustesExistencias = new Map<number, AjusteExistencia>();
  private proximoAjusteId = 1;

  private bitacoras = new Map<number, BitacoraReserva>();
  private proximoBitacoraId = 1;

  private inspeccionesPieza = new Map<number, InspeccionPieza>();
  private proximoInspeccionId = 1;

  async listar(): Promise<Administrador[]> {
    return Array.from(this.administradores.values()).map((admin) => ({ ...admin }));
  }

  async buscarPorId(id: number): Promise<Administrador | null> {
    const admin = this.administradores.get(Number(id));
    return admin ? admin : null;
  }

  async crear(datos: Omit<Administrador, 'id'>): Promise<Administrador> {
    const id = this.proximoId++;
    const nuevoAdmin: Administrador = {
      id,
      ...datos,
    };
    this.administradores.set(id, nuevoAdmin);
    return nuevoAdmin;
  }

  async actualizar(id: number, datos: Partial<Administrador>): Promise<Administrador | null> {
    const adminExistente = this.administradores.get(id);
    if (!adminExistente) {
      return null;
    }
    const adminActualizado: Administrador = {
      ...adminExistente,
      ...datos,
      id: adminExistente.id,
    };
    this.administradores.set(id, adminActualizado);
    return adminActualizado;
  }

  async eliminar(id: number): Promise<Administrador | null> {
    const admin = this.administradores.get(Number(id));
    if (!admin) return null;
    this.administradores.delete(Number(id));
    return admin;
  }

  async obtenerCantidadPiezasMantenimiento(articuloId: number): Promise<number> {
    let cantidadPiezas = 0;
    [...this.piezasMantenimiento.values()].filter((p) => p.articuloId === articuloId).forEach((p) => cantidadPiezas += p.cantidad);
    return cantidadPiezas;
  }

  async obtenerCantidadPiezasMantenimientoPeriodo(articuloId: number, fechaInicio: Date, fechaFin: Date): Promise<number> {
    let cantidadPiezas = 0;
    const piezas = [...this.piezasMantenimiento.values()]
      .filter((p) => p.articuloId === articuloId && (
          (fechaInicio >= p.fechaInicio && fechaInicio <= p.fechaTermino) || 
          (fechaFin >= p.fechaInicio && fechaFin <= p.fechaTermino)
        ));
    piezas.forEach((p) => cantidadPiezas += p.cantidad);
    return cantidadPiezas;
  }

  async registrarAjuste(datos: NuevoAjusteExistencia): Promise<AjusteExistencia> {
    const id = this.proximoAjusteId++;
    const nuevoAjuste: AjusteExistencia = {
      id: id,
      ...datos,
      creadoEn: new Date()
    };
    this.ajustesExistencias.set(id, nuevoAjuste);
    return nuevoAjuste;
  }

  async registrarPiezasMantenimiento(datos: Omit<PiezasMantenimiento, 'id'>): Promise<PiezasMantenimiento> {
    const id = this.proximoMantenimientoId++;
    const nuevoPiezasMantenimiento: PiezasMantenimiento = {
      id: id,
      ...datos
    };
    this.piezasMantenimiento.set(id, nuevoPiezasMantenimiento);
    return nuevoPiezasMantenimiento;
  }

  async registrarEntrega(registroEntrada: RegistroEntradaBitacora): Promise<BitacoraReserva> {
    const id = this.proximoBitacoraId;
    const nuevaBitacora: BitacoraReserva = {
      id: id,
      reservaId: registroEntrada.reservaId,
      fechaHoraEntregada: new Date(),
      montoTotalGarantía: registroEntrada.montoTotalGarantía
    };
    this.bitacoras.set(id, nuevaBitacora);
    return nuevaBitacora;
  }

  async obtenerBitacoraPorReserva(reservaId: number): Promise<BitacoraReserva | null>{
    return [...this.bitacoras.values()].find((b) => b.reservaId === reservaId) ?? null;
  }

  async registrarRecoleccion(bitacoraId: number, inspeccionesPiezas: NuevoInspeccionPieza[]): Promise<BitacoraReserva> {
    const bitacora = this.bitacoras.get(bitacoraId);
    if (!bitacora) {
      const bitacoraUnknown: BitacoraReserva = {
        id: -1,
        reservaId: -1,
        fechaHoraEntregada: new Date('2015-10-18'),
        fechaHoraRecolectada: new Date('2016-02-02'),
        montoTotalGarantía: Number.MAX_VALUE
      };
      return bitacoraUnknown;
    }
    bitacora.fechaHoraRecolectada = new Date();
    inspeccionesPiezas.forEach((p) => {
      const id = this.proximoInspeccionId++;
      const inspeccionArticulo: InspeccionPieza = {
        id: id,
        articuloReservadoId: p.articuloReservadoId,
        bitacoraReservaId: bitacoraId,
        piezasCompletas: p.piezasCompletas,
        piezasDaniadas: p.piezasDaniadas,
        piezasFaltantes: p.piezasFaltantes,
        montoGarantia: p.montoGarantia
      }
      this.inspeccionesPieza.set(id, inspeccionArticulo);
    });
    return bitacora;
  }

}
