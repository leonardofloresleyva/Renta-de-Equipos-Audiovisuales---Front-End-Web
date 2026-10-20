import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsIn, IsInt, IsOptional, IsPositive } from 'class-validator';

const MOTIVOS_AJUSTE = ['perdida', 'adquisicion', 'deterioro'] as const;

export class FiltrosAjusteExistenciaDto {
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
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean({ message: 'El filtro esIncremento debe ser true o false.' })
  esIncremento?: boolean;

  @IsOptional()
  @IsIn(MOTIVOS_AJUSTE, {
    message: 'El motivo debe ser pérdida, adquisición o deterioro.',
  })
  motivo?: (typeof MOTIVOS_AJUSTE)[number];
}
