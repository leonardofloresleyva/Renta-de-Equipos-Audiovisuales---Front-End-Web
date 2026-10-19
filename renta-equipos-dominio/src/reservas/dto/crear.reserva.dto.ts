import { ArticuloReservaDto } from "./articulo.reserva.dto";
import { ArrayNotEmpty, IsDate, IsInt, IsNotEmpty, IsPositive, IsString, Length, MaxLength, min } from "class-validator";

export class CrearReservaDto {
    @IsInt({message: "El Id del cliente debe ser un entero"})
    @IsPositive({message: "El Id del cliente debe ser positivo"})
    clienteId: number;

    @IsDate({message: "Fecha de entrega inválida"})
    fechaEntrega: Date;

    @IsDate({message: "Fecha de recoleccion inválida"})
    fechaRecoleccion: Date;

    @IsString({message: "La calle debe ser texto"})
    @IsNotEmpty({message: "La calle no debe estar vacía"})
    @MaxLength(100, {message: "La calle puede tener un máximo de 100 caracteres"})
    calle: string;

    @IsString({message: "El número debe ser texto"})
    @IsNotEmpty({message: "El número no debe estar vacío"})
    @MaxLength(20, {message: "El número puede tener un máximo de 20 caracteres"})
    numero: string;

    @IsString({message: "La colonia debe ser texto"})
    @IsNotEmpty({message: "La colonia no debe estar vacía"})
    @MaxLength(100, {message: "La colonia puede tener un máximo de 100 caracteres"})
    colonia: string;

    @ArrayNotEmpty({message: "Sin artículos asociados"})
    articulos: ArticuloReservaDto[]
}