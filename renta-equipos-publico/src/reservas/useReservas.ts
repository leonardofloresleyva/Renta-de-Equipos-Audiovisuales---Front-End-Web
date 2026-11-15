import { useContext } from 'react';
import { ReservasContext } from './reservas-context.ts';

export function useReservas() {
  const contexto = useContext(ReservasContext);
  if (!contexto) {
    throw new Error('useReservas debe usarse dentro de ProveedorReservas.');
  }
  return contexto;
}
