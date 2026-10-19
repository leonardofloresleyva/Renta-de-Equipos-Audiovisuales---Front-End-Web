import { IsDate, IsIn, IsOptional } from "class-validator";

const ESTADOS = ["pendiente", "aprovada", "rechazada"];

export class FiltrosSolicitudesDto {
    @IsOptional()
    @IsDate({message: "Fecha de inico inválida"})
    fechaInicio?: Date;

    @IsOptional()
    @IsDate({message: "Fecha fin inválida"})
    fechaFin?: Date;

    @IsOptional()
    @IsIn(ESTADOS)
    estado?: 'pendiente' | 'aprovada' | 'rechazada';
}