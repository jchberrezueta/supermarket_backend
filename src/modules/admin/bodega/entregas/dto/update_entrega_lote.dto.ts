import { EnumEstadoDetalleEntregaLote } from '@models';
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

export class UpdateEntregaLoteDTO {
  @IsOptional()
  @Transform(({ value }) => optionalInt(value))
  @IsInt()
  @Min(0)
  ideDetaEntrLote?: number;

  @IsOptional()
  @Transform(({ value }) => optionalInt(value))
  @IsInt()
  @Min(0)
  ideDetaEntr?: number;

  @IsOptional()
  @Transform(({ value }) => optionalInt(value))
  @IsInt()
  @Min(0)
  ideLote?: number;

  @IsDateString()
  fechaCaducidadLote!: string;

  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(1)
  cantidadLote!: number;

  @IsOptional()
  @IsEnum(EnumEstadoDetalleEntregaLote)
  estadoDetaEntrLote?: EnumEstadoDetalleEntregaLote;
}
