import { Injectable } from "@nestjs/common";
import { PiezasMantenimientoRepository } from "../repositorios/piezas.mantenimiento.repository";
import { PIEZAS_MANTENIMIENTO } from "src/datos/renta.equipo.seed";
import { FiltrosMantenimiento, PiezasMantenimiento } from "src/dominio/entidades";

@Injectable()
export class PiezasMantenimientoMemoriaRepository implements PiezasMantenimientoRepository {

    private proximoId = 3;

    async listar(): Promise<PiezasMantenimiento[]> {
        return [...PIEZAS_MANTENIMIENTO.values()];
    }

    async buscarPorId(id: number): Promise<PiezasMantenimiento | null> {
        const piezas = PIEZAS_MANTENIMIENTO.get(id);
        return (piezas) ? piezas : null;
    }

    async busquedaFiltrada(filtros: FiltrosMantenimiento): Promise<PiezasMantenimiento[]> {
        return [...PIEZAS_MANTENIMIENTO.values()].filter((p) => {
            // Filtro por id del articulo
            if (filtros.articuloId !== undefined && (filtros.articuloId !== p.articuloId)) return false;
            // Filtro por id del administrador
            if (filtros.adminId !== undefined && (filtros.adminId !== p.adminId)) return false;
            // Filtro por cantidad mínima
            if (filtros.cantidadMinima !== undefined && (p.cantidad < filtros.cantidadMinima)) return false;
            // Filtro por cantidad máxima
            if (filtros.cantidadMaxima !== undefined && (p.cantidad > filtros.cantidadMaxima)) return false;
            // Filtro por fecha de inicio
            if (filtros.fechaInicio && (p.fechaInicio < filtros.fechaInicio)) return false;
            // Filtro por fecha de término
            if (filtros.fechaTermino && (p.fechaTermino > filtros.fechaTermino)) return false;
            // Filtro por motivo
            if (filtros.motivo && (p.motivo !== filtros.motivo)) return false;
            // Regresa todos si no hay filtro
            return true;
        });
    }

    async obtenerCantidad(articuloId: number): Promise<number> {
        let cantidadPiezas = 0;
        [...PIEZAS_MANTENIMIENTO.values()].filter((p) => p.articuloId === articuloId).forEach((p) => cantidadPiezas += p.cantidad);
        return cantidadPiezas;
    }

    async obtenerCantidadPorPeriodo(articuloId: number, fechaInicio: Date, fechaFin: Date): Promise<number> {
        let cantidadPiezas = 0;
        const piezas = [...PIEZAS_MANTENIMIENTO.values()]
        .filter((p) => p.articuloId === articuloId && (
            (fechaInicio >= p.fechaInicio && fechaInicio <= p.fechaTermino) || 
            (fechaFin >= p.fechaInicio && fechaFin <= p.fechaTermino)
        ));
        piezas.forEach((p) => cantidadPiezas += p.cantidad);
        return cantidadPiezas;
    }

    async crear(datos: Omit<PiezasMantenimiento, 'id'>): Promise<PiezasMantenimiento> {
        const id = this.proximoId++;
        const nuevoPiezasMantenimiento: PiezasMantenimiento = { id: id, ...datos };
        PIEZAS_MANTENIMIENTO.set(id, nuevoPiezasMantenimiento);
        return nuevoPiezasMantenimiento;
    }
}