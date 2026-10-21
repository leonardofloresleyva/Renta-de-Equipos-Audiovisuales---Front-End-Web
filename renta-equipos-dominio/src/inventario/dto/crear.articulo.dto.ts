import {
  ArrayMaxSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';

export class CrearArticuloDto {
  @IsString({ message: 'El nombre debe ser texto.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @MaxLength(200, { message: 'El nombre no puede superar los 200 caracteres.' })
  nombre!: string;

  @IsString({ message: 'La descripción debe ser texto.' })
  @IsNotEmpty({ message: 'La descripción es obligatoria.' })
  @MaxLength(2000, {
    message: 'La descripción no puede superar los 2000 caracteres.',
  })
  descripcion!: string;

  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'El precio por día debe ser un número válido.' },
  )
  @Min(0, { message: 'El precio por día no puede ser negativo.' })
  precioPorDia!: number;

  @IsNumber(
    { allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 },
    { message: 'Las existencias deben ser un número entero.' },
  )
  @Min(0, { message: 'Las existencias no pueden ser negativas.' })
  existencias!: number;

  @IsString({ message: 'La categoría debe ser texto.' })
  @IsNotEmpty({ message: 'La categoría es obligatoria.' })
  @MaxLength(100, {
    message: 'La categoría no puede superar los 100 caracteres.',
  })
  categoria!: string;

  @IsArray({ message: 'Las fotografías deben enviarse como una lista de URLs.' })
  @ArrayMaxSize(5, {
    message: 'No se pueden registrar más de 5 fotografías por artículo.',
  })
  @IsUrl(
    {},
    {
      each: true,
      message: 'Cada fotografía debe tener una URL válida.',
    },
  )
  fotografiasUrl!: string[];
}
