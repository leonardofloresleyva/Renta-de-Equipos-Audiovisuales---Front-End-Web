import { Type } from 'class-transformer';
import { IsDate, IsIn, IsInt, IsOptional, IsPositive } from 'class-validator';

const MOTIVOS_MANTENIMIENTO = ['reparacion', 'limpieza'] as const;

export class FiltrosMantenimientoDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El ID del artículo debe ser un número entero.' })
  @IsPositive({ message: 'El ID del artículo debe ser positivo.' })
  articuloId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El ID del administrador debe ser un número entero.' })
  @IsPositive({ message: 'El ID del administrador debe ser positivo.' })
  adminId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'La cantidad mínima debe ser un número entero.' })
  @IsPositive({ message: 'La cantidad mínima debe ser mayor que cero.' })
  cantidadMinima?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'La cantidad máxima debe ser un número entero.' })
  @IsPositive({ message: 'La cantidad máxima debe ser mayor que cero.' })
  cantidadMaxima?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'La fecha de inicio debe ser una fecha válida.' })
  fechaInicio?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'La fecha de término debe ser una fecha válida.' })
  fechaTermino?: Date;

  @IsOptional()
  @IsIn(MOTIVOS_MANTENIMIENTO, {
    message: 'El motivo debe ser reparación o limpieza.',
  })
  motivo?: (typeof MOTIVOS_MANTENIMIENTO)[number];
}
