import { create } from 'zustand';
import { mensajeDeError } from '../../services/api.ts';
import { traerMisReservas } from '../../services/reservas.ts';
import type { Reserva } from '../../tipos.ts';

interface EstadoReservas {
    lista: Reserva[];
    cargando: boolean;
    error: string | null;
    cargar: () => Promise<void>;
    vaciar: () => void;
}

let solicitudActual = 0;

export const useReservas = create<EstadoReservas>()((set) => ({
    lista: [],
    cargando: true,
    error: null,

    cargar: async () => {
        const solicitud = ++solicitudActual;
        set({ cargando: true, error: null });
        try {
            const lista = await traerMisReservas();
            if (solicitud === solicitudActual) set({ lista });
        } catch (error) {
            if (solicitud === solicitudActual) {
                set({ error: mensajeDeError(error, 'No pudimos cargar tus reservas.') });
            }
        } finally {
            if (solicitud === solicitudActual) set({ cargando: false });
        }
    },

    vaciar: () => {
        solicitudActual += 1;
        set({ lista: [], cargando: false, error: null });
    },
}));
