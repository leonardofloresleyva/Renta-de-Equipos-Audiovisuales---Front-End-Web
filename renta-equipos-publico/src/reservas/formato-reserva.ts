import type { Reserva } from '../tipos.ts';

export type EstadoReserva = Reserva['estado'];

const ETIQUETAS: Record<EstadoReserva, string> = {
  apartada: 'Apartada',
  entregada: 'En curso',
  devuelta: 'Finalizada',
  cancelada: 'Cancelada',
};

const CLASES: Record<EstadoReserva, string> = {
  apartada: 'reserva-estado reserva-estado--apartada',
  entregada: 'reserva-estado reserva-estado--curso',
  devuelta: 'reserva-estado reserva-estado--finalizada',
  cancelada: 'reserva-estado reserva-estado--cancelada',
};

export function etiquetaEstado(estado: EstadoReserva): string {
  return ETIQUETAS[estado];
}

export function claseEstado(estado: EstadoReserva): string {
  return CLASES[estado];
}

export function formatearFecha(fecha: string): string {
  const valor = new Date(fecha);
  if (Number.isNaN(valor.getTime())) return '—';

  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(valor);
}

export function formatearFechaCreacion(fecha: string): string {
  const valor = new Date(fecha);
  if (Number.isNaN(valor.getTime())) return '—';

  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(valor);
}

export function diasDeReserva(reserva: Pick<Reserva, 'fechaEntrega' | 'fechaRecoleccion'>): number {
  const inicio = new Date(reserva.fechaEntrega).getTime();
  const fin = new Date(reserva.fechaRecoleccion).getTime();

  if (!Number.isFinite(inicio) || !Number.isFinite(fin) || fin <= inicio) return 1;

  return Math.max(1, Math.round((fin - inicio) / 86_400_000));
}
