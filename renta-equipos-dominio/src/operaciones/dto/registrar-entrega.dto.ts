import { IsInt, IsPositive } from 'class-validator';

export class RegistrarEntregaDto {
  @IsInt({ message: 'El Id de la reserva debe ser un entero' })
  @IsPositive({ message: 'El Id de la reserva debe ser positivo' })
  reservaId!: number;
}
