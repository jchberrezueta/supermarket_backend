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
import { UpdateEntregaLoteDTO } from './update_entrega_lote.dto';

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

export class UpdateEntregaDetalleDTO {
  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(1)
  ideDetaEntr!: number;

  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(1)
  ideEntr!: number;

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
   * El backend reemplaza estos valores utilizando
   * el detalle del pedido relacionado.
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

  @IsOptional()
  @IsEnum(EnumEstadoDetalleEntrega)
  estadoDetaEntr: EnumEstadoDetalleEntrega =
    EnumEstadoDetalleEntrega.NO_ENTREGADO;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateEntregaLoteDTO)
  lotesRecibidos?: UpdateEntregaLoteDTO[];
}
