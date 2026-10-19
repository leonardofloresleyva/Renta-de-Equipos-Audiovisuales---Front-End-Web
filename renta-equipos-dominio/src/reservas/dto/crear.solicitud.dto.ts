import { IsInt, IsPositive } from "class-validator";

export class CrearSolicitudDto {
  @IsInt({message: "El Id del cliente debe ser un entero"})
  @IsPositive({message: "El Id del cliente de ser positivo"})
  clienteId: number;

  @IsInt({message: "El Id de la reserva debe ser un entero"})
  @IsPositive({message: "El Id de la reserva de ser positivo"})
  reservaId: number;
}