import { EnumEstadoVenta } from '@models';
import { Transform } from 'class-transformer';
import {
  IsDateString,
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

export class FilterVentaDTO {
  @IsOptional()
  @Transform(({ value }) => optionalInt(value))
  @IsInt()
  @Min(0)
  ideEmpl?: number;

  @IsOptional()
  @Transform(({ value }) => optionalInt(value))
  @IsInt()
  @Min(0)
  ideClie?: number;

  @IsOptional()
  @IsString()
  @Length(1, 25)
  @Transform(({ value }) => optionalString(value))
  numFacturaVent?: string;

  @IsOptional()
  @IsEnum(EnumEstadoVenta)
  estadoVent?: EnumEstadoVenta;

  @IsOptional()
  @Transform(({ value }) => optionalString(value))
  @IsDateString()
  fechaDesde?: string;

  @IsOptional()
  @Transform(({ value }) => optionalString(value))
  @IsDateString()
  fechaHasta?: string;
}
