import { IsDate, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

const ESTADOS = ["apartada", "entregada", "devuelta", "cancelada"];

export class FiltrosReserva {
    @IsOptional()
    @IsString({message: "El nombre del cliente debe ser texto"})
    @MaxLength(300, {message: "El nombre del cliente puede tener un máximo de 20 caracteres"})
    nombreCliente?: string;
    
    @IsOptional()
    @IsDate({message: "Fecha de entrega inválida"})
    fechaEntrega?: Date;

    @IsOptional()
    @IsDate({message: "Fecha de recoleccion inválida"})
    fechaRecoleccion?: Date;

    @IsOptional()
    @IsIn(ESTADOS)
    estado?: 'apartada'| 'entregada'| 'devuelta' | 'cancelada';
}