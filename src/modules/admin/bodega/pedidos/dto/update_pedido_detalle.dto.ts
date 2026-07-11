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

function toRequiredNumber(value: unknown): number | unknown {
  if (value === null || value === undefined || value === '') {
    return value;
  }

  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : value;
}

export class UpdatePedidoDetalleDTO {
  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(1)
  ideDetaPedi!: number;

  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(1)
  idePedi!: number;

  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(1)
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

  /**
   * Mientras el pedido sea borrador,
   * sus detalles permanecen pendientes.
   */
  @IsOptional()
  @IsEnum(EnumEstadoDetallePedido)
  estadoDetaPedi: EnumEstadoDetallePedido = EnumEstadoDetallePedido.PENDIENTE;
}
