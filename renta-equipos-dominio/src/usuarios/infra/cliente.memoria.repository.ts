import { Injectable } from '@nestjs/common';
import { ClienteRepository } from '../repositorios/cliente.repository';
import { Cliente, Direccion, NuevoUsuario, Rol } from 'src/dominio/entidades';
import { CLIENTES } from 'src/datos/renta.equipo.seed';

@Injectable()
export class ClienteMemoriaRepository implements ClienteRepository {
  async listar(): Promise<Cliente[]> {
    return [...CLIENTES.values()];
  }

  async buscarPorId(id: number): Promise<Cliente | null> {
    const cliente = CLIENTES.get(id);
    return cliente ? cliente : null;
  }

  async buscarPorEmail(email: string): Promise<Cliente | null> {
    const cliente = [...CLIENTES.values()].find(
      (c) => c.email.toLowerCase() === email.toLowerCase(),
    );
    return cliente ? cliente : null;
  }

  async crear(
    nuevo: NuevoUsuario,
    nuevaDireccion: Omit<Direccion, 'id'>,
  ): Promise<Cliente> {
    const id = Math.max(0, ...CLIENTES.keys()) + 1;
    const cliente: Cliente = {
      id,
      email: nuevo.email,
      passwordHash: nuevo.passwordHash,
      rol: Rol.cliente,
      creadoEn: new Date(),
      nombre: nuevo.nombre,
      telefono: nuevo.telefono,
      direccion: { id, ...nuevaDireccion },
    };
    CLIENTES.set(id, cliente);
    return cliente;
  }

  async actualizar(
    id: number,
    datos: Partial<Cliente>,
  ): Promise<Cliente | null> {
    const clienteExistente = CLIENTES.get(id);
    if (!clienteExistente) return null;
    const clienteActualizado: Cliente = {
      ...clienteExistente,
      ...datos,
      id: clienteExistente.id,
      direccion: datos.direccion
        ? { ...clienteExistente.direccion, ...datos.direccion }
        : clienteExistente.direccion,
    };
    CLIENTES.set(id, clienteActualizado);
    return clienteActualizado;
  }

  async eliminar(id: number): Promise<Cliente | null> {
    const cliente = CLIENTES.get(id);
    if (!cliente) return null;
    CLIENTES.delete(id);
    return cliente;
  }
}
