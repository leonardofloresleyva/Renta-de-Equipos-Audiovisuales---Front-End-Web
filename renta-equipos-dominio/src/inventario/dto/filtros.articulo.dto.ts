import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class FiltrosArticuloDto {
  @IsOptional()
  @IsString({ message: 'El filtro de nombre debe ser texto.' })
  nombre?: string;

  @IsOptional()
  @IsString({ message: 'El filtro de descripción debe ser texto.' })
  descripcion?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'El precio mínimo debe ser un número válido.' },
  )
  @Min(0, { message: 'El precio mínimo no puede ser negativo.' })
  precioMinimo?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'El precio máximo debe ser un número válido.' },
  )
  @Min(0, { message: 'El precio máximo no puede ser negativo.' })
  precioMaximo?: number;

  @IsOptional()
  @IsString({ message: 'El filtro de categoría debe ser texto.' })
  categoria?: string;
}
