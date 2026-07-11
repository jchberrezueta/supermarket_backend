import { EnumEstadosProducto } from '@models';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsIn,
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

  if (typeof value !== 'string') {
    return value;
  }

  const text = value.trim();

  return text !== '' ? text : undefined;
}

export class FilterProductoDTO {
  @IsOptional()
  @Transform(({ value }) => optionalInt(value))
  @IsInt()
  @Min(0)
  ideCate?: number;

  @IsOptional()
  @Transform(({ value }) => optionalInt(value))
  @IsInt()
  @Min(0)
  ideMarc?: number;

  @IsOptional()
  @IsString()
  @Length(1, 30)
  @Transform(({ value }) => optionalString(value))
  codigoBarraProd?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  @Transform(({ value }) => optionalString(value))
  nombreProd?: string;

  @IsOptional()
  @IsIn(['si', 'no'])
  disponibleProd?: 'si' | 'no';

  @IsOptional()
  @IsEnum(EnumEstadosProducto)
  estadoProd?: EnumEstadosProducto;
}
