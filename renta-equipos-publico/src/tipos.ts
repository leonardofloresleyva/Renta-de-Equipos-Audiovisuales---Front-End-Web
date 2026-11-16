export interface Articulo {
    id: number;
    nombre: string;
    descripcion: string;
    precioPorDia: number;
    existencias: number;
    categoria: string;
    fotografiasUrl: string[];
}

export interface FiltrosArticulo {
    nombre?: string;
    descripcion?: string;
    precioMinimo?: number;
    precioMaximo?: number;
    categoria?: string;
}

export interface NuevoArticuloReserva {
    articuloId: number;
    cantidad: number;
}

export interface NuevaReserva {
    fechaEntrega: Date;
    fechaRecoleccion: Date;
    calle: string;
    numero: string;
    colonia: string;
    articulos: NuevoArticuloReserva[]
}

export interface Reserva {
    id: number;
    clienteId: number;
    folio: string;
    montoTotal: number;
    fechaEntrega: Date;
    fechaRecoleccion: Date;
    creadoEn: Date;
    estado: 'apartada'| 'entregada'| 'devuelta' | 'cancelada';
    calle: string;
    numero: string;
    colonia: string;
}

export interface ArticuloReserva {
    id: number;
    articuloId: number;
    reservaId: number;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
}