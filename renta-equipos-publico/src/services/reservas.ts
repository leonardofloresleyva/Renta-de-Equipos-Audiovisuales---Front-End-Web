import { api, type Sobre } from './api.ts';
import type { NuevaReserva, Reserva } from '../tipos.ts';

export async function registrarReserva(reserva: NuevaReserva): Promise<Reserva> {
  const respuesta = await api.post<Sobre<Reserva>>('/reservas', reserva);
  return respuesta.data.data;
}

export async function obtenerMisReservas(): Promise<Reserva[]> {
  const respuesta = await api.get<Sobre<Reserva[]>>('/reservas/mias');
  return respuesta.data.data;
}