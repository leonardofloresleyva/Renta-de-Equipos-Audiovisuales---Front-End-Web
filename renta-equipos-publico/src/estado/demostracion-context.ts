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
  actualizarPeriodo: (fechaEntrega: string, fechaRecoleccion: string) => void;
  agregar: (articulo: ArticuloDemo, cantidad: number) => void;
  quitar: (id: number) => void;
}

export const DemostracionContext = createContext<Demostracion | null>(null);
