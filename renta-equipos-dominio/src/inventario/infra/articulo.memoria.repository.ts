import { ARTICULOS } from "src/datos/renta.equipo.seed";
import { ArticuloRepository } from "../repositorios/articulo.repository";
import { Articulo, FiltrosArticulo } from "src/dominio/entidades";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ArticuloMemoriaRepository implements ArticuloRepository {
    
    private proximoId = 6;

    async listar(): Promise<Articulo[]> {
        return [...ARTICULOS.values()];
    }

    async buscarPorId(id: number): Promise<Articulo | null> {
        const articulo = ARTICULOS.get(id);
        return (articulo) ? articulo : null;
    }

    async busquedaFiltrada(filtros: FiltrosArticulo): Promise<Articulo[]> {
        return [...ARTICULOS.values()].filter((articulo) => {
            // Filtro por nombre
            if (filtros.nombre) {
                const nombreFiltro = filtros.nombre.toLowerCase();
                const nombreArticulo = articulo.nombre.toLowerCase();
                if (!nombreArticulo.includes(nombreFiltro)) return false;
            }
            // Filtro por descripción
            if (filtros.descripcion) {
                const descFiltro = filtros.descripcion.toLowerCase();
                const descArticulo = articulo.descripcion.toLowerCase();
                if (!descArticulo.includes(descFiltro)) return false;
            }
            // Filtro por categoria
            if (filtros.categoria && (articulo.categoria.toLowerCase() !== filtros.categoria.toLowerCase())) return false;
            // Filtro por precio mínimo
            if (filtros.precioMinimo !== undefined && (articulo.precioPorDia < filtros.precioMinimo)) return false;
            // Filtro por precio máximo
            if (filtros.precioMaximo !== undefined && (articulo.precioPorDia > filtros.precioMaximo)) return false;
            // Regresa todos si no hay filtros
            return true;
        });
    }

    async crear(datos: Omit<Articulo, 'id'>): Promise<Articulo> {
        const id = this.proximoId++;
        const nuevoArticulo: Articulo = {
            id,
            ...datos,
            fotografiasUrl: [...(datos.fotografiasUrl || [])]
        };
        ARTICULOS.set(id, nuevoArticulo);
        return nuevoArticulo;
    }

    async actualizar(id: number, datos: Partial<Articulo>): Promise<Articulo | null> {
        const articuloExistente = ARTICULOS.get(id);
        if (!articuloExistente) return null;
        const articuloActualizado: Articulo = {
            ...articuloExistente,
            ...datos,
            id: articuloExistente.id,
            fotografiasUrl: datos.fotografiasUrl
                ? [...datos.fotografiasUrl]
                : [...articuloExistente.fotografiasUrl]
        };
        ARTICULOS.set(id, articuloActualizado);
        return articuloActualizado;
    }

    async eliminar(id: number): Promise<Articulo | null> {
        const articulo = ARTICULOS.get(id);
        if (!articulo) return null;
        ARTICULOS.delete(id);
        return articulo;
    }
}