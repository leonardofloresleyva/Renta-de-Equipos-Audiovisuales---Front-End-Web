import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class RegistroDto {
    @IsEmail({}, { message: 'el correo no tiene un formato valido' })
    correo: string;

    @MinLength(8, { message: 'la contrasena es obligatoria' })
    password: string;

    @MinLength(1, {message: "el nombre es obligatorio"})
    @MaxLength(100, {message: "el nombre es demasiado largo"})
    nombre: string;

    @MinLength(1, {message: "el telefono es obligatorio"})
    @MaxLength(20, {message: "el telefono es demasiado largo"})
    telefono: string;

    @MinLength(1, {message: "la calle es obligatoria"})
    @MaxLength(100, {message: "la calle es demasiado larga"})
    calle: string;

    @MinLength(1, {message: "La colonia es obligatorio"})
    @MaxLength(100, {message: "La colonia es demasiado larga"})
    colonia: string;

    @MinLength(1, {message: "el número es obligatorio"})
    @MaxLength(20, {message: "el número es demasiado largo"})
    numero: string;
}

export class LoginDto {
    @IsEmail({}, { message: 'el correo no tiene un formato valido' })
    correo: string;

    @MinLength(1, { message: 'la contrasena es obligatoria' })
    password: string;
}

export class TokenDto {
    access_token: string;
    token_type: string;
    expires_in: number;
}