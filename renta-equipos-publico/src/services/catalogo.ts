import { type Articulo, type FiltrosArticulo } from '../tipos.ts';
import { api, type Sobre } from './api.ts';

export async function traerArticulos(filtros: FiltrosArticulo): Promise<Articulo[]> {
    const respuesta = await api.get<Sobre<Articulo[]>>('/articulos', { params: filtros });
    return respuesta.data.data;
}

export async function traerArticulo(id: number): Promise<Articulo> {
    const respuesta = await api.get<Sobre<Articulo>>(`/articulos/${id}`);
    return respuesta.data.data;
}