import { EnumEstadoDetalleEntrega } from '@models';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateEntregaLoteDTO } from './create_entrega_lote.dto';

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

export class CreateEntregaDetalleDTO {
  @IsOptional()
  @Transform(({ value }) => optionalInt(value))
  @IsInt()
  @Min(0)
  ideDetaEntr?: number;

  @IsOptional()
  @Transform(({ value }) => optionalInt(value))
  @IsInt()
  @Min(0)
  ideEntr?: number;

  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(1)
  ideDetaPedi!: number;

  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(1)
  ideProd!: number;

  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(0)
  cantidadProd!: number;

  /**
   * Estos valores se mantienen opcionales para no romper
   * el frontend actual.
   *
   * El backend los reemplaza utilizando detalle_pedido.
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
   * El backend recalcula este estado.
   */
  @IsOptional()
  @IsEnum(EnumEstadoDetalleEntrega)
  estadoDetaEntr: EnumEstadoDetalleEntrega =
    EnumEstadoDetalleEntrega.NO_ENTREGADO;

  /**
   * Puede estar vacío cuando cantidadProd es cero.
   * Al confirmar, toda cantidad positiva requiere lotes.
   */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEntregaLoteDTO)
  lotesRecibidos?: CreateEntregaLoteDTO[];
}
