import { EnumEstadosProducto } from '@models';
import { Transform } from 'class-transformer';
import { IsEnum, IsIn, IsOptional, IsString, Length } from 'class-validator';

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
  @IsString()
  @Length(1, 100)
  @Transform(({ value }) => optionalString(value))
  categoria?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  @Transform(({ value }) => optionalString(value))
  marca?: string;

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
