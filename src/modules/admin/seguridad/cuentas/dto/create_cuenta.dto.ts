import { EnumEstadosCuenta } from '@models';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsString, Length, Min } from 'class-validator';

function toRequiredInt(value: unknown): number | unknown {
  if (value === null || value === undefined || value === '') {
    return value;
  }

  const numberValue = Number(value);

  return Number.isInteger(numberValue) ? numberValue : value;
}

export class CreateCuentaDto {
  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(1)
  ideEmpl!: number;

  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(1)
  idePerf!: number;

  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsString()
  @Length(1, 25)
  usuarioCuen!: string;

  @IsString()
  @Length(8, 100)
  passwordCuen!: string;

  @IsEnum(EnumEstadosCuenta)
  estadoCuen!: EnumEstadosCuenta;
}
