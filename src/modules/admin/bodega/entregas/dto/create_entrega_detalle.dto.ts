import { EnumEstadoDetalleEntrega } from '@models';
import { Type } from 'class-transformer';
import { Transform } from 'class-transformer';
import {
  ArrayMinSize,
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
  @Min(0)
  ideDetaPedi!: number;

  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(0)
  ideProd!: number;

  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(0)
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

  @IsEnum(EnumEstadoDetalleEntrega)
  estadoDetaEntr!: EnumEstadoDetalleEntrega;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateEntregaLoteDTO)
  lotesRecibidos?: CreateEntregaLoteDTO[];
}
