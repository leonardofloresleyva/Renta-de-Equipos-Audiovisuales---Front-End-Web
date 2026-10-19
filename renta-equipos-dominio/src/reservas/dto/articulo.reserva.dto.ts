import { IsInt, IsPositive, Min } from "class-validator";

export class ArticuloReservaDto {
    @IsInt({message: "El Id del artículo debe ser un entero"})
    @IsPositive({message: "El Id del artículo debe ser positivo"})
    articuloId: number;

    @IsInt({message: "La cantidad debe ser un entero"})
    @IsPositive({message: "Por lo menos debe tener una pieza seleccionada"})
    cantidad: number;
}