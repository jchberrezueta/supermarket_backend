import { EnumEstadosCuenta } from '@models';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

function optionalInt(value: unknown): number | undefined | unknown {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }

  const numberValue = Number(value);

  if (Number.isInteger(numberValue)) {
    return numberValue;
  }

  return value;
}

function optionalBoolean(value: unknown): boolean | undefined | unknown {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const text = value.trim().toLowerCase();

    if (['true', '1', 'si', 'sí'].includes(text)) {
      return true;
    }

    if (['false', '0', 'no'].includes(text)) {
      return false;
    }
  }

  return value;
}

export class FiltroCuentaDto {
  @IsOptional()
  @Transform(({ value }) => optionalInt(value))
  @IsInt()
  @Min(0)
  ideEmpl?: number;

  @IsOptional()
  @Transform(({ value }) => optionalInt(value))
  @IsInt()
  @Min(0)
  idePerf?: number;

  @IsOptional()
  @IsString()
  @Length(1, 25)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined,
  )
  usuarioCuen?: string;

  @IsOptional()
  @IsEnum(EnumEstadosCuenta)
  estadoCuen?: EnumEstadosCuenta;

  @IsOptional()
  @Transform(({ value }) => optionalBoolean(value))
  @IsBoolean()
  debeCambiarClave?: boolean;
}
