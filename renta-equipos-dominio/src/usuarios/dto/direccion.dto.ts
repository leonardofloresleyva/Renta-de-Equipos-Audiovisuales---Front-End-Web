import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class DireccionDto {
  @IsString({ message: 'La calle debe ser texto.' })
  @IsNotEmpty({ message: 'La calle es obligatoria.' })
  @MaxLength(100, { message: 'La calle no puede superar los 100 caracteres.' })
  calle: string;

  @IsString({ message: 'La colonia debe ser texto.' })
  @IsNotEmpty({ message: 'La colonia es obligatoria.' })
  @MaxLength(100, {
    message: 'La colonia no puede superar los 100 caracteres.',
  })
  colonia: string;

  @IsString({ message: 'El número debe ser texto.' })
  @IsNotEmpty({ message: 'El número es obligatorio.' })
  @MaxLength(20, { message: 'El número no puede superar los 20 caracteres.' })
  numero: string;
}

export class ActualizarDireccionDto {
  @IsOptional()
  @IsString({ message: 'La calle debe ser texto.' })
  @IsNotEmpty({ message: 'La calle no puede estar vacía.' })
  @MaxLength(100, { message: 'La calle no puede superar los 100 caracteres.' })
  calle?: string;

  @IsOptional()
  @IsString({ message: 'La colonia debe ser texto.' })
  @IsNotEmpty({ message: 'La colonia no puede estar vacía.' })
  @MaxLength(100, {
    message: 'La colonia no puede superar los 100 caracteres.',
  })
  colonia?: string;

  @IsOptional()
  @IsString({ message: 'El número debe ser texto.' })
  @IsNotEmpty({ message: 'El número no puede estar vacío.' })
  @MaxLength(20, { message: 'El número no puede superar los 20 caracteres.' })
  numero?: string;
}
