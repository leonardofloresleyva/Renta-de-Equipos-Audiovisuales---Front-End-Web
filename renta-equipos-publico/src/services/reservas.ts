import type { NuevaReserva, Reserva } from "../tipos";
import { api } from "./api";

export async function crearReserva(nueva: NuevaReserva): Promise<Reserva> {
    const respuesta = await api.post('/reservas', { nueva });
    return respuesta.data.data;
}

export async function traerMisReservas(): Promise<Reserva[]> {
    const respuesta = await api.get('/reservas/mias');
    return respuesta.data.data;
}

export async function traerMiReserva(id: number): Promise<Reserva> {
    const respuesta = await api.get(`/reservas/articulos/${id}`);
    return respuesta.data.data;
}