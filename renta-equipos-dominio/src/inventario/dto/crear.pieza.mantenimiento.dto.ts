import { Type } from 'class-transformer';
import {
  IsDate,
  IsIn,
  IsInt,
  IsPositive,
} from 'class-validator';

const MOTIVOS_MANTENIMIENTO = ['reparacion', 'limpieza'] as const;

export class CrearPiezaMantenimientoDto {
  @IsInt({ message: 'El ID del artículo debe ser un número entero.' })
  @IsPositive({ message: 'El ID del artículo debe ser positivo.' })
  articuloId!: number;

  @IsInt({ message: 'El ID del administrador debe ser un número entero.' })
  @IsPositive({ message: 'El ID del administrador debe ser positivo.' })
  adminId!: number;

  @IsInt({ message: 'La cantidad debe ser un número entero.' })
  @IsPositive({ message: 'La cantidad debe ser mayor que cero.' })
  cantidad!: number;

  @Type(() => Date)
  @IsDate({ message: 'La fecha de inicio debe ser una fecha válida.' })
  fechaInicio!: Date;

  @Type(() => Date)
  @IsDate({ message: 'La fecha de término debe ser una fecha válida.' })
  fechaTermino!: Date;

  @IsIn(MOTIVOS_MANTENIMIENTO, {
    message: 'El motivo debe ser reparación o limpieza.',
  })
  motivo!: (typeof MOTIVOS_MANTENIMIENTO)[number];
}
