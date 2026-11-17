import axios from 'axios';
import type {
    ArticuloReserva,
    DepositoGarantia,
    NuevaReserva,
    Reserva,
} from '../tipos.ts';
import { api, type Sobre } from './api.ts';

export async function crearReserva(nueva: NuevaReserva): Promise<Reserva> {
    const respuesta = await api.post<Sobre<Reserva>>('/reservas', nueva);
    return respuesta.data.data;
}

export async function traerMisReservas(): Promise<Reserva[]> {
    const respuesta = await api.get<Sobre<Reserva[]>>('/reservas/mias');
    return respuesta.data.data;
}

export async function traerArticulosDeReserva(reservaId: number): Promise<ArticuloReserva[]> {
    const respuesta = await api.get<Sobre<ArticuloReserva[]>>(`/reservas/articulos/${reservaId}`);
    return respuesta.data.data;
}

export async function traerGarantiaReserva(reservaId: number): Promise<DepositoGarantia | null> {
    try {
        const respuesta = await api.get<Sobre<DepositoGarantia>>(`/reservas/garantias/${reservaId}`);
        return respuesta.data.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) return null;
        throw error;
    }
}
