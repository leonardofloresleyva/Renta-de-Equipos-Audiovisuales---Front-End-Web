import { Injectable } from '@nestjs/common';
import type { AdminRepository } from '../dominio/admin.repository';
import type { Administrador } from '../dominio/entidades';

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

  async listar(): Promise<Administrador[]> {
    return Array.from(this.administradores.values()).map((admin) => ({ ...admin }));
  }

  async buscarPorId(id: number): Promise<Administrador | null> {
    const admin = this.administradores.get(Number(id));
    return admin ? { ...admin } : null;
  }

  async crear(datos: Omit<Administrador, 'id'>): Promise<Administrador> {
    const id = this.proximoId++;
    const nuevoAdmin: Administrador = {
      id,
      ...datos,
    };
    this.administradores.set(id, nuevoAdmin);
    return { ...nuevoAdmin };
  }

  async actualizar(id: number, datos: Partial<Administrador>): Promise<Administrador | null> {
    const adminExistente = this.administradores.get(Number(id));
    if (!adminExistente) {
      return null;
    }
    const adminActualizado: Administrador = {
      ...adminExistente,
      ...datos,
      id: adminExistente.id,
    };
    this.administradores.set(Number(id), adminActualizado);
    return { ...adminActualizado };
  }

  async eliminar(id: number): Promise<Administrador | null> {
    const admin = this.administradores.get(Number(id));
    if (!admin) {
      return null;
    }
    this.administradores.delete(Number(id));
    return { ...admin };
  }
}
