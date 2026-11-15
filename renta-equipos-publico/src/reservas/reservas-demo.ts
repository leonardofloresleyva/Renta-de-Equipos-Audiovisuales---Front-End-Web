export type EstadoReserva = 'Apartada' | 'En curso' | 'Finalizada' | 'Cancelación solicitada';

export interface ArticuloReservado {
  nombre: string;
  precioPorDia: number;
  cantidad: number;
  imagen: string;
}

export interface ReservaDemo {
  id: string;
  fechaInicio: string;
  fechaFin: string;
  fechaCreacion: string;
  estado: EstadoReserva;
  articulos: ArticuloReservado[];
  deposito: number;
  motivoCancelacion?: string;
}

export const reservasDemoIniciales: ReservaDemo[] = [
  {
    id: 'RES-2026-084',
    fechaInicio: '2026-11-18',
    fechaFin: '2026-11-21',
    fechaCreacion: '2026-11-12',
    estado: 'Apartada',
    articulos: [{ nombre: 'Proyector Láser Epson Pro L1070U', precioPorDia: 1560, cantidad: 2, imagen: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=300&q=80' }],
    deposito: 1560,
  },
  {
    id: 'RES-2026-079',
    fechaInicio: '2026-11-12',
    fechaFin: '2026-11-15',
    fechaCreacion: '2026-11-08',
    estado: 'En curso',
    articulos: [{ nombre: 'Sistema de audio para evento', precioPorDia: 1410, cantidad: 2, imagen: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=300&q=80' }],
    deposito: 1410,
  },
  {
    id: 'RES-2026-065',
    fechaInicio: '2026-10-24',
    fechaFin: '2026-10-28',
    fechaCreacion: '2026-10-19',
    estado: 'Finalizada',
    articulos: [{ nombre: 'Paquete de iluminación para escenario', precioPorDia: 5880, cantidad: 1, imagen: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=300&q=80' }],
    deposito: 1882,
  },
  {
    id: 'RES-2026-051',
    fechaInicio: '2026-10-05',
    fechaFin: '2026-10-07',
    fechaCreacion: '2026-10-01',
    estado: 'Finalizada',
    articulos: [{ nombre: 'Proyector y pantalla para presentación', precioPorDia: 4740, cantidad: 1, imagen: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&w=300&q=80' }],
    deposito: 1580,
  },
  {
    id: 'RES-2026-439',
    fechaInicio: '2026-11-14',
    fechaFin: '2026-11-17',
    fechaCreacion: '2026-11-12',
    estado: 'Apartada',
    articulos: [{ nombre: 'Sony FX6 Full-Frame Cinema', precioPorDia: 1850, cantidad: 1, imagen: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=300&q=80' }],
    deposito: 1110,
  },
];

export function diasDeReserva(reserva: ReservaDemo): number {
  const inicio = new Date(`${reserva.fechaInicio}T12:00:00`);
  const fin = new Date(`${reserva.fechaFin}T12:00:00`);
  return Math.max(1, Math.ceil((fin.getTime() - inicio.getTime()) / 86_400_000));
}

export function subtotalReserva(reserva: ReservaDemo): number {
  return reserva.articulos.reduce(
    (total, articulo) => total + articulo.precioPorDia * articulo.cantidad * diasDeReserva(reserva),
    0,
  );
}

export function fechaReserva(fecha: string): string {
  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${fecha}T12:00:00Z`));
}
