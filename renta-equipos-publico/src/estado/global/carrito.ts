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
}

export const useCarrito = create<Carrito>()((set, get) => ({
    lista: [],
    fechaEntrega: '',
    fechaRecoleccion: '',
    actualizarPeriodo: (nuevaFechaEntrega: string, nuevaFechaRecoleccion: string) => {
        set((state) => {
            if (state.lista.length > 0) return state;
            return {
                fechaEntrega: nuevaFechaEntrega,
                fechaRecoleccion: nuevaFechaRecoleccion <= nuevaFechaEntrega ? '' : nuevaFechaRecoleccion
            };
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
    }
}));