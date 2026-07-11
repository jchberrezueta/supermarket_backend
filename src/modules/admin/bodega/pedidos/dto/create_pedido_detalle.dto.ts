import { EnumEstadoDetallePedido } from '@models';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsNumber, IsOptional, Min } from 'class-validator';

function toRequiredInt(value: unknown): number | unknown {
  if (value === null || value === undefined || value === '') {
    return value;
  }

  const numberValue = Number(value);

  return Number.isInteger(numberValue) ? numberValue : value;
}

function toOptionalNumber(value: unknown): number | undefined | unknown {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }

  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : value;
}

function optionalInt(value: unknown): number | undefined | unknown {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }

  const numberValue = Number(value);

  return Number.isInteger(numberValue) ? numberValue : value;
}

export class CreatePedidoDetalleDTO {
  @IsOptional()
  @Transform(({ value }) => optionalInt(value))
  @IsInt()
  @Min(1)
  ideDetaPedi?: number;

  @IsOptional()
  @Transform(({ value }) => optionalInt(value))
  @IsInt()
  @Min(1)
  idePedi?: number;

  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(1)
  ideProd!: number;

  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(1)
  cantidadProd!: number;

  /**
   * Los valores económicos son opcionales para conservar
   * compatibilidad con el frontend actual.
   *
   * El backend ignora estos valores y los recalcula
   * utilizando empresa_precios.
   */
  @IsOptional()
  @Transform(({ value }) => toOptionalNumber(value))
  @IsNumber()
  @Min(0)
  precioUnitarioProd: number = 0;

  @IsOptional()
  @Transform(({ value }) => toOptionalNumber(value))
  @IsNumber()
  @Min(0)
  subtotalProd: number = 0;

  @IsOptional()
  @Transform(({ value }) => toOptionalNumber(value))
  @IsNumber()
  @Min(0)
  dctoCompraProd: number = 0;

  @IsOptional()
  @Transform(({ value }) => toOptionalNumber(value))
  @IsNumber()
  @Min(0)
  ivaProd: number = 0;

  @IsOptional()
  @Transform(({ value }) => toOptionalNumber(value))
  @IsNumber()
  @Min(0)
  totalProd: number = 0;

  @IsOptional()
  @Transform(({ value }) => toOptionalNumber(value))
  @IsNumber()
  @Min(0)
  dctoCaducProd: number = 0;

  /**
   * El backend siempre fuerza pendiente.
   */
  @IsOptional()
  @IsEnum(EnumEstadoDetallePedido)
  estadoDetaPedi: EnumEstadoDetallePedido = EnumEstadoDetallePedido.PENDIENTE;
}
