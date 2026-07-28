import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

function optionalInt(value: unknown): number | undefined | unknown {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }

  const numberValue = Number(value);

  return Number.isInteger(numberValue) ? numberValue : value;
}

function optionalTrimmedString(value: unknown): string | undefined | unknown {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (typeof value !== 'string') {
    return value;
  }

  const result = value.trim();

  return result === '' ? undefined : result;
}

export class FilterAccesoUsuarioDto {
  @IsOptional()
  @Transform(({ value }) => optionalInt(value))
  @IsInt()
  @Min(1)
  ideCuen?: number;

  @IsOptional()
  @Transform(({ value }) => optionalTrimmedString(value))
  @IsString()
  @MaxLength(45)
  ipAcce?: string;

  @IsOptional()
  @Transform(({ value }) => optionalTrimmedString(value))
  @IsString()
  @MaxLength(25)
  usuarioCuen?: string;

  @IsOptional()
  @Transform(({ value }) => optionalTrimmedString(value))
  @IsString()
  @MaxLength(250)
  navegadorAcce?: string;

  @IsOptional()
  @Transform(({ value }) => optionalTrimmedString(value))
  @IsIn(['exitoso', 'fallido'])
  resultadoAcce?: 'exitoso' | 'fallido';

  @IsOptional()
  @IsDateString()
  fechaAcceDesde?: string;

  @IsOptional()
  @IsDateString()
  fechaAcceHasta?: string;
}
