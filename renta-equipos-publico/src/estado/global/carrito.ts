import { create } from "zustand";
import type { Articulo } from "../../tipos";

export interface ArticuloCarrito {
    articulo: Articulo;
    cantidad: number;
}

export interface Carrito {
    lista: ArticuloCarrito[];
    fechaEntrega: string;
    fechaRecoleccion: string;
    actualizarPeriodo: (fechaEntrega: string, fechaRecoleccion: string) => void;
    agregar: (articulo: Articulo, cantidad: number) => void;
    quitar: (id: number) => void;
    vaciar: () => void;
    totalPiezas: () => number;
    precioTotal: () => number;
    diasRenta: () => number;
    totalRenta: () => number;
    depositoGarantia: () => number;
    totalReserva: () => number;
}

function diferenciaEnDias(fechaEntrega: string, fechaRecoleccion: string): number {
    if (!fechaEntrega || !fechaRecoleccion || fechaRecoleccion <= fechaEntrega) return 0;

    const convertir = (fecha: string) => {
        const [anio, mes, dia] = fecha.split('-').map(Number);
        return Date.UTC(anio, mes - 1, dia);
    };

    return Math.round((convertir(fechaRecoleccion) - convertir(fechaEntrega)) / 86_400_000);
}

export const useCarrito = create<Carrito>()((set, get) => ({
    lista: [],
    fechaEntrega: '',
    fechaRecoleccion: '',
    actualizarPeriodo: (nuevaFechaEntrega: string, nuevaFechaRecoleccion: string) => {
        set({
            fechaEntrega: nuevaFechaEntrega,
            fechaRecoleccion: nuevaFechaRecoleccion <= nuevaFechaEntrega ? '' : nuevaFechaRecoleccion
        });
    },
    agregar: (articulo: Articulo, cantidad: number) => {
        set((state) => {
            if (!state.fechaEntrega || !state.fechaRecoleccion || state.fechaRecoleccion <= state.fechaEntrega) return state;
            const existe = state.lista.find((item) => item.articulo.id === articulo.id);
            if (existe) {
                return {
                    ...state,
                    lista: state.lista.map((item) =>
                        item.articulo.id === articulo.id
                            ? { ...item, cantidad: Math.min(item.cantidad + cantidad, articulo.existencias) }
                            : item
                    )
                };
            }
            return {
                ...state,
                lista: [...state.lista, { articulo, cantidad: Math.min(cantidad, articulo.existencias) }]
            };
        });
    },
    quitar: (id: number) => {
        set((state) => ({
            ...state,
            lista: state.lista.filter((item) => item.articulo.id !== id)
        }));
    },
    vaciar: () => {
        set({ lista: [] });
    },
    totalPiezas: () => {
        return get().lista.reduce((total, item) => total + item.cantidad, 0);
    },
    precioTotal: () => {
        return get().lista.reduce((total, item) => total + item.articulo.precioPorDia * item.cantidad, 0);
    },
    diasRenta: () => {
        const { fechaEntrega, fechaRecoleccion } = get();
        return diferenciaEnDias(fechaEntrega, fechaRecoleccion);
    },
    totalRenta: () => {
        return get().precioTotal() * get().diasRenta();
    },
    depositoGarantia: () => {
        return Math.round(get().totalRenta() * 0.2 * 100) / 100;
    },
    totalReserva: () => {
        return get().totalRenta() + get().depositoGarantia();
    }
}));