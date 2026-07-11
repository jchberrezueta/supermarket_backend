import { EnumEstadoDetallePedido } from '@models';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsNumber, Min } from 'class-validator';

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

function toRequiredNumber(value: unknown): number | unknown {
  if (value === null || value === undefined || value === '') {
    return value;
  }

  const numberValue = Number(value);

  if (Number.isFinite(numberValue)) {
    return numberValue;
  }

  return value;
}

export class UpdatePedidoDetalleDTO {
  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(0)
  ideDetaPedi!: number;

  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(0)
  idePedi!: number;

  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(0)
  ideProd!: number;

  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(1)
  cantidadProd!: number;

  @Transform(({ value }) => toRequiredNumber(value))
  @IsNumber()
  @Min(0)
  precioUnitarioProd!: number;

  @Transform(({ value }) => toRequiredNumber(value))
  @IsNumber()
  @Min(0)
  subtotalProd!: number;

  @Transform(({ value }) => toRequiredNumber(value))
  @IsNumber()
  @Min(0)
  dctoCompraProd!: number;

  @Transform(({ value }) => toRequiredNumber(value))
  @IsNumber()
  @Min(0)
  ivaProd!: number;

  @Transform(({ value }) => toRequiredNumber(value))
  @IsNumber()
  @Min(0)
  totalProd!: number;

  @Transform(({ value }) => toRequiredNumber(value))
  @IsNumber()
  @Min(0)
  dctoCaducProd!: number;

  @IsEnum(EnumEstadoDetallePedido)
  estadoDetaPedi!: EnumEstadoDetallePedido;
}
