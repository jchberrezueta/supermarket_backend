import { EnumEstadoEntrega } from '@models';
import { Transform } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsOptional, Min } from 'class-validator';

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

export class FilterEntregaDTO {
  @IsOptional()
  @Transform(({ value }) => optionalInt(value))
  @IsInt()
  @Min(0)
  idePedi?: number;

  @IsOptional()
  @Transform(({ value }) => optionalInt(value))
  @IsInt()
  @Min(0)
  ideProv?: number;

  @IsOptional()
  @IsEnum(EnumEstadoEntrega)
  estadoEntr?: EnumEstadoEntrega;

  @IsOptional()
  @Transform(({ value }) => optionalString(value))
  @IsDateString()
  fechaDesde?: string;

  @IsOptional()
  @Transform(({ value }) => optionalString(value))
  @IsDateString()
  fechaHasta?: string;
}
