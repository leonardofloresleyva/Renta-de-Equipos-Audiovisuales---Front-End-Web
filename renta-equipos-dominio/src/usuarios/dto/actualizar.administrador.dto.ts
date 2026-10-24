import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ActualizarAdministradorDto {
  @IsOptional()
  @IsEmail({}, { message: 'El correo no tiene un formato válido.' })
  correo?: string;

  @IsOptional()
  @IsString({ message: 'La contraseña debe ser texto.' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  @MaxLength(72, {
    message: 'La contraseña no puede superar los 72 caracteres.',
  })
  password?: string;

  @IsOptional()
  @IsString({ message: 'El nombre debe ser texto.' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
  @MaxLength(300, { message: 'El nombre no puede superar los 300 caracteres.' })
  nombre?: string;

  @IsOptional()
  @IsString({ message: 'El teléfono debe ser texto.' })
  @MaxLength(20, { message: 'El teléfono no puede superar los 20 caracteres.' })
  telefono?: string;
}
