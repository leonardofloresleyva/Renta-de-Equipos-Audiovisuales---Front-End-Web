import { useState } from 'react';
import { mensajeDeError } from '../services/api.ts';
import { crearReserva } from '../services/reservas.ts';
import type { NuevaReserva, Reserva } from '../tipos.ts';

export function useRegistrarReserva() {
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  async function registrar(reserva: NuevaReserva): Promise<Reserva | null> {
    setGuardando(true);
    setError('');
    try {
      return await crearReserva(reserva);
    } catch (error: unknown) {
      setError(mensajeDeError(error, 'No se pudo registrar la reserva. Intenta de nuevo.'));
      return null;
    } finally {
      setGuardando(false);
    }
  }

  return { registrar, guardando, error };
}
