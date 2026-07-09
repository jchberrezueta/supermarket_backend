import { EnumEstadosCuenta } from '@models';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

function toRequiredInt(value: unknown): number | unknown {
  if (value === null || value === undefined || value === '') {
    return value;
  }

  const numberValue = Number(value);

  if (Number.isInteger(numberValue)) {
    return numberValue;
  }

  return value;
}

export class UpdateCuentaDto {
  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(0)
  ideCuen!: number;

  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(0)
  ideEmpl!: number;

  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(0)
  idePerf!: number;

  @IsString()
  @Length(1, 25)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== ''
      ? value.trim().toLowerCase()
      : null,
  )
  usuarioCuen!: string;

  /**
   * En actualización la contraseña es opcional:
   * - si no viene o viene vacía, se conserva la clave actual
   * - si viene con valor, el service la encripta
   */
  @IsOptional()
  @IsString()
  @Length(1, 250)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined,
  )
  passwordCuen?: string;

  @IsEnum(EnumEstadosCuenta)
  estadoCuen!: EnumEstadosCuenta;
}
