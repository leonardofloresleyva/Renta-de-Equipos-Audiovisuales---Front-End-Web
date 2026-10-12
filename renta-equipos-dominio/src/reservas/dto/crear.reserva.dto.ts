import { ArticuloReservaDto } from "./articulo.reserva.dto";

export interface CrearReservaDto {
    clienteId: number;
    fechaEntrega: Date;
    fechaRecoleccion: Date;
    calle: string;
    numero: string;
    colonia: string;
    articulos: ArticuloReservaDto[]
}