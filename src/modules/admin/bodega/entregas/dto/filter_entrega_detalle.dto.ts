import { EnumEstadoDetalleEntrega } from '@models';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';

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

export class FilterEntregaDetalleDTO {
  @IsOptional()
  @Transform(({ value }) => optionalInt(value))
  @IsInt()
  @Min(0)
  ideEntr?: number;

  @IsOptional()
  @Transform(({ value }) => optionalInt(value))
  @IsInt()
  @Min(0)
  ideDetaPedi?: number;

  @IsOptional()
  @Transform(({ value }) => optionalInt(value))
  @IsInt()
  @Min(0)
  ideProd?: number;

  @IsOptional()
  @IsEnum(EnumEstadoDetalleEntrega)
  estadoDetaEntr?: EnumEstadoDetalleEntrega;
}
