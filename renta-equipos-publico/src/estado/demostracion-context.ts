import { createContext } from 'react';
import type { ArticuloDemo } from '../catalogo/articulos-demo.ts';

export interface ArticuloEnLista {
  articulo: ArticuloDemo;
  cantidad: number;
}

export interface Demostracion {
  lista: ArticuloEnLista[];
  totalPiezas: number;
  fechaEntrega: string;
  fechaRecoleccion: string;
  fechaMinima: string;
  diasRenta: number;
  totalArticulos: number;
  depositoGarantia: number;
  totalReserva: number;
  agregar: (articulo: ArticuloDemo, cantidad: number) => void;
  quitar: (id: number) => void;
  limpiar: () => void;
  cambiarFechaEntrega: (fecha: string) => void;
  cambiarFechaRecoleccion: (fecha: string) => void;
}

export const DemostracionContext = createContext<Demostracion | null>(null);
