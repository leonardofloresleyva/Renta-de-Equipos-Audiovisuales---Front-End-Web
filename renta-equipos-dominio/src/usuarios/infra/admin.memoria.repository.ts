import { Injectable } from "@nestjs/common";
import { AdminRepository } from "../repositorios/admin.repository";
import { Administrador } from "src/dominio/entidades";
import { ADMINS } from "src/datos/renta.equipo.seed";

@Injectable()
export class AdminMemoriaRepository implements AdminRepository {
    
    private proximoId = 3;

    async listar(): Promise<Administrador[]> {
        return [...ADMINS.values()];
    }

    async buscarPorId(id: number): Promise<Administrador | null> {
        const admin = ADMINS.get(id);
        return (admin) ? admin : null;
    }

    async buscarPorEmail(email: string): Promise<Administrador | null> {
        const admin = [...ADMINS.values()].find((c) => c.email === email);
        return (admin) ? admin : null;
    }

    async crear(datos: Omit<Administrador, 'id'>): Promise<Administrador> {
        const id = this.proximoId++;
        const nuevoAdmin: Administrador = {
            id,
            ...datos
        };
        ADMINS.set(id, nuevoAdmin);
        return nuevoAdmin;
    }

    async actualizar(id: number, datos: Partial<Administrador>): Promise<Administrador | null> {
        const adminExistente = ADMINS.get(id);
        if (!adminExistente) return null;
        const adminActualizado: Administrador = {
            ...adminExistente,
            ...datos,
            id: adminExistente.id
        };
        ADMINS.set(id, adminActualizado);
        return adminActualizado;
    }

    async eliminar(id: number): Promise<Administrador | null> {
        const admin = ADMINS.get(id);
        if (!admin) return null;
        ADMINS.delete(id);
        return admin;
    }
}