import { createContext } from 'react';
import type { ReservaDemo } from './reservas-demo.ts';

export interface ReservasContexto {
  reservas: ReservaDemo[];
  solicitarCancelacion: (id: string, motivo: string) => void;
}

export const ReservasContext = createContext<ReservasContexto | null>(null);
