import { Injectable } from "@nestjs/common";
import { ClienteRepository } from "../repositorios/cliente.repository";
import { Cliente } from "src/dominio/entidades";
import { CLIENTES } from "src/datos/renta.equipo.seed";

@Injectable()
export class ClienteMemoriaRepository implements ClienteRepository {
    
    private proximoId = 3;

    async listar(): Promise<Cliente[]> {
        return [...CLIENTES.values()];
    }

    async buscarPorId(id: number): Promise<Cliente | null> {
        const cliente = CLIENTES.get(id);
        return (cliente) ? cliente : null;
    }

    async crear(datos: Omit<Cliente, 'id'>): Promise<Cliente> {
        const id = this.proximoId++;
        const nuevoCliente: Cliente = {
            id,
            ...datos,
            direccion: { ...datos.direccion }
        };
        CLIENTES.set(id, nuevoCliente);
        return nuevoCliente;
    }

    async actualizar(id: number, datos: Partial<Cliente>): Promise<Cliente | null> {
        const clienteExistente = CLIENTES.get(id);
        if (!clienteExistente) return null;
        const clienteActualizado: Cliente = {
            ...clienteExistente,
            ...datos,
            id: clienteExistente.id,
            direccion: datos.direccion ? { ...clienteExistente.direccion, ...datos.direccion } : clienteExistente.direccion
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