import { Type } from 'class-transformer';
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { DireccionDto } from './direccion.dto';

export class CrearClienteDto {
  @IsEmail({}, { message: 'El correo no tiene un formato válido.' })
  correo: string;

  @IsString({ message: 'La contraseña debe ser texto.' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  @MaxLength(72, {
    message: 'La contraseña no puede superar los 72 caracteres.',
  })
  password: string;

  @IsString({ message: 'El nombre debe ser texto.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @MaxLength(300, { message: 'El nombre no puede superar los 300 caracteres.' })
  nombre: string;

  @IsString({ message: 'El teléfono debe ser texto.' })
  @IsNotEmpty({ message: 'El teléfono es obligatorio.' })
  @MaxLength(20, { message: 'El teléfono no puede superar los 20 caracteres.' })
  telefono: string;

  @IsDefined({ message: 'La dirección es obligatoria.' })
  @ValidateNested()
  @Type(() => DireccionDto)
  direccion: DireccionDto;
}
