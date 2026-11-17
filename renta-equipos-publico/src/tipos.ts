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

export interface DisponibilidadArticulo {
    articuloId: number;
    fechaInicio: Date;
    fechaFin: Date;
}

export interface NuevoArticuloReserva {
    articuloId: number;
    cantidad: number;
}

export interface NuevaReserva {
    fechaEntrega: string;
    fechaRecoleccion: string;
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
    fechaEntrega: string;
    fechaRecoleccion: string;
    creadoEn: string;
    estado: 'apartada'| 'entregada'| 'devuelta' | 'cancelada';
    calle: string;
    numero: string;
    colonia: string;
}

export interface DepositoGarantia {
    id: number;
    reservaId: number;
    monto: number;
}

export interface ArticuloReserva {
    id: number;
    articuloId: number;
    reservaId: number;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
}

export type Rol = 'cliente' | 'administrador';

export interface UsuarioSesion {
    correo: string;
    nombre: string;
    rol: Rol;
}

export interface PayloadJwt {
    sub: number;
    perfilId: number;
    correo: string;
    rol: Rol;
    iat?: number;
    exp?: number;
}

export interface RespuestaToken {
    access_token: string;
    token_type: string;
    expires_in: number;
    usuario: UsuarioSesion;
}

export interface Sesion {
    token: string;
    usuario: UsuarioSesion;
    perfilId: number;
    expiraEn: number;
}

export interface DatosRegistro {
    nombre: string;
    correo: string;
    password: string;
    telefono: string;
    calle: string;
    numero: string;
    colonia: string;
}