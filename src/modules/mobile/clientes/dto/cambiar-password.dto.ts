import { Transform } from 'class-transformer';
import { IsString, MinLength } from 'class-validator';

export class CambiarPasswordDto {
  @IsString()
  @MinLength(1)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : null,
  )
  passwordActual!: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : null,
  )
  passwordNuevo!: string;
}
