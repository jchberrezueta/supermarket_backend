import { Transform } from 'class-transformer';
import { IsIn, IsOptional, IsString, Length } from 'class-validator';

function optionalString(value: unknown): string | undefined | unknown {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === 'string') {
    const text = value.trim();
    return text !== '' ? text : undefined;
  }

  return value;
}

function requiredUpperString(value: unknown): string | null | unknown {
  if (typeof value === 'string' && value.trim() !== '') {
    return value.trim().toUpperCase();
  }

  return null;
}

function requiredLowerString(value: unknown): string | null | unknown {
  if (typeof value === 'string' && value.trim() !== '') {
    return value.trim().toLowerCase();
  }

  return null;
}

function optionalLowerString(value: unknown): string | undefined | unknown {
  const text = optionalString(value);

  return typeof text === 'string' ? text.toLowerCase() : text;
}

export class CreateIotDispositivoDto {
  @IsString()
  @Length(1, 50)
  @Transform(({ value }) => requiredUpperString(value))
  codigoDispositivo!: string;

  @IsString()
  @Length(1, 100)
  @Transform(({ value }) => requiredLowerString(value))
  nombreDispositivo!: string;

  @IsString()
  @Length(1, 150)
  @Transform(({ value }) => requiredLowerString(value))
  ubicacionDispositivo!: string;

  /**
   * Opcional porque la BD y el service usan 'esp32_dht22'
   * cuando no se envía tipo.
   */
  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Transform(({ value }) => optionalLowerString(value))
  tipoDispositivo?: string;

  /**
   * Opcional porque el service usa 'activo' si no se envía.
   */
  @IsOptional()
  @IsIn(['activo', 'inactivo'])
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== ''
      ? value.trim().toLowerCase()
      : undefined,
  )
  estadoDispositivo?: 'activo' | 'inactivo';

  /**
   * Opcional porque la BD y el service usan 'ninguna'
   * si no se envía descripción.
   */
  @IsOptional()
  @IsString()
  @Length(1, 250)
  @Transform(({ value }) => optionalLowerString(value))
  descripcionDispositivo?: string;
}
