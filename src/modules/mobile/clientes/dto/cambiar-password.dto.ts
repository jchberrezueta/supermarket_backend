import { IsString, MinLength } from 'class-validator';

export class CambiarPasswordDto {
    @IsString()
    @MinLength(1)
    passwordActual: string;

    @IsString()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    passwordNuevo: string;
}
