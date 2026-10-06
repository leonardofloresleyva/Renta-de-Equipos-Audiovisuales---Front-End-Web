import { AjusteExistencia, FiltrosAjusteExistencia, NuevoAjusteExistencia } from "src/dominio/entidades";
import { AjusteExistenciaRepository } from "../repositorios/ajuste.existencia.repository";
import { AJUSTES_EXISTENCIA } from "src/datos/renta.equipo.seed";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AjusteExistenciaMemoriaRepository implements AjusteExistenciaRepository {
    
    private proximoId = 1;

    async listar(): Promise<AjusteExistencia[]> {
        return [...AJUSTES_EXISTENCIA.values()];
    }

    async buscarPorId(id: number): Promise<AjusteExistencia | null> {
        const ajuste = AJUSTES_EXISTENCIA.get(id);
        return (ajuste) ? ajuste : null;
    }

    async busquedaFiltrada(filtros: FiltrosAjusteExistencia): Promise<AjusteExistencia[]> {
        return [...AJUSTES_EXISTENCIA.values()].filter((ajuste) => {
            // Filtro por id del admin
            if (filtros.adminId !== undefined && (filtros.adminId !== ajuste.adminId)) return false;
            // Filtro por id del articulo
            if (filtros.articuloId !== undefined && (filtros.articuloId !== ajuste.articuloId)) return false;
            // Filtro por cantidad mínima
            if (filtros.cantidadMinima !== undefined && (ajuste.cantidad < filtros.cantidadMinima)) return false;
            // Filtro por cantidad máxima
            if (filtros.cantidadMaxima !== undefined && (ajuste.cantidad > filtros.cantidadMaxima)) return false;
            // Filtro por tipo de incremento
            if (filtros.esIncremento !== undefined && (filtros.esIncremento !== ajuste.esIncremento)) return false;
            // Filtro por motivo
            if (filtros.motivo && (filtros.motivo !== ajuste.motivo)) return false;
            // Si no hay filtros, regresa todos
            return true;
        });
    }

    async crear(datos: NuevoAjusteExistencia): Promise<AjusteExistencia> {
        const id = this.proximoId++;
        const nuevoAjuste: AjusteExistencia = {
            id: id,
            ...datos,
            creadoEn: new Date()
        };
        AJUSTES_EXISTENCIA.set(id, nuevoAjuste);
        return nuevoAjuste;
    }
}