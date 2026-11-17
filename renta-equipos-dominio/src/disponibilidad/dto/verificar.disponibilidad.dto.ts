import { IsDate } from "class-validator";

export class PeriodoDisponibilidadDto {
  @IsDate()
  fechaInicio: Date;

  @IsDate()
  fechaFin: Date;
}