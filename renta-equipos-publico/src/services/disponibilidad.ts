import type { DisponibilidadArticulo } from "../tipos";
import { api } from "./api";

export async function traerDisponibilidad(disponibilidad: DisponibilidadArticulo): Promise<number> {
    const respuesta = await api.get<{ data: number }>(`/disponibilidad/${disponibilidad.articuloId}`, {
        params: {
            fechaInicio: disponibilidad.fechaInicio.toISOString(),
            fechaFin: disponibilidad.fechaFin.toISOString(),
        },
    });
    const cantidadDisponible = respuesta.data.data;
    if (!Number.isSafeInteger(cantidadDisponible) || cantidadDisponible < 0) {
        throw new Error('La API devolvió una disponibilidad inválida.');
    }
    return cantidadDisponible;
}