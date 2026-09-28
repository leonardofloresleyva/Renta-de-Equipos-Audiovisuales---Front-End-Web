import { Injectable } from '@nestjs/common';
import type { ClienteRepository } from '../dominio/cliente.repository';
import type { Cliente } from '../dominio/entidades';

@Injectable()
export class ClienteMemoriaRepository implements ClienteRepository {
  private clientes = new Map<number, Cliente>([
    [
      1,
      {
        id: 1,
        email: 'contacto@eventospro.mx',
        password: 'passwordCliente123',
        nombre: 'Producciones Eventos Pro SA de CV',
        telefono: '6444112233',
        direccion: {
          id: 1,
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
        email: 'sofia.castro@gmail.com',
        password: 'passwordCliente456',
        nombre: 'Sofía Castro Morales',
        telefono: '6447788990',
        direccion: {
          id: 2,
          numero: '1280-B',
          calle: 'Blvd. Rodolfo Elías Calles',
          colonia: 'Náinari del Yaqui',
        },
      },
    ],
  ]);

  private proximoId = 3;

  async listar(): Promise<Cliente[]> {
    return Array.from(this.clientes.values()).map((c) => ({
      ...c,
      direccion: { ...c.direccion },
    }));
  }

  async buscarPorId(id: number): Promise<Cliente | null> {
    const cliente = this.clientes.get(Number(id));
    if (!cliente) return null;
    return {
      ...cliente,
      direccion: { ...cliente.direccion },
    };
  }

  async crear(datos: Omit<Cliente, 'id'>): Promise<Cliente> {
    const id = this.proximoId++;
    const nuevoCliente: Cliente = {
      id,
      ...datos,
      direccion: { ...datos.direccion },
    };
    this.clientes.set(id, nuevoCliente);
    return {
      ...nuevoCliente,
      direccion: { ...nuevoCliente.direccion },
    };
  }

  async actualizar(id: number, datos: Partial<Cliente>): Promise<Cliente | null> {
    const clienteExistente = this.clientes.get(Number(id));
    if (!clienteExistente) {
      return null;
    }
    const clienteActualizado: Cliente = {
      ...clienteExistente,
      ...datos,
      id: clienteExistente.id,
      direccion: datos.direccion
        ? { ...clienteExistente.direccion, ...datos.direccion }
        : clienteExistente.direccion,
    };
    this.clientes.set(Number(id), clienteActualizado);
    return {
      ...clienteActualizado,
      direccion: { ...clienteActualizado.direccion },
    };
  }

  async eliminar(id: number): Promise<Cliente | null> {
    const cliente = this.clientes.get(Number(id));
    if (!cliente) {
      return null;
    }
    this.clientes.delete(Number(id));
    return {
      ...cliente,
      direccion: { ...cliente.direccion },
    };
  }
}
