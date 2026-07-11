import { EnumEstadosProducto } from '@models';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

function toRequiredNumber(value: unknown): number | unknown {
  if (value === null || value === undefined || value === '') {
    return value;
  }

  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : value;
}

function toRequiredInt(value: unknown): number | unknown {
  if (value === null || value === undefined || value === '') {
    return value;
  }

  const numberValue = Number(value);

  return Number.isInteger(numberValue) ? numberValue : value;
}

function optionalInt(value: unknown): number | undefined | unknown {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }

  const numberValue = Number(value);

  return Number.isInteger(numberValue) ? numberValue : value;
}

function requiredLowerText(value: unknown): string | null | unknown {
  if (typeof value !== 'string') {
    return value;
  }

  const text = value.trim();

  return text !== '' ? text.toLowerCase() : null;
}

function optionalLowerText(value: unknown): string | null | unknown {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value !== 'string') {
    return value;
  }

  const text = value.trim();

  return text !== '' ? text.toLowerCase() : null;
}

function optionalText(value: unknown): string | null | unknown {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value !== 'string') {
    return value;
  }

  const text = value.trim();

  return text !== '' ? text : null;
}

export class UpdateProductoDTO {
  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(0)
  ideProd!: number;

  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(0)
  ideCate!: number;

  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(0)
  ideMarc!: number;

  @IsString()
  @Length(1, 30)
  @Transform(({ value }) => requiredLowerText(value))
  codigoBarraProd!: string;

  @IsString()
  @Length(1, 100)
  @Transform(({ value }) => requiredLowerText(value))
  nombreProd!: string;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  @Transform(({ value }) => optionalText(value))
  urlImgProd?: string | null;

  @Transform(({ value }) => toRequiredNumber(value))
  @IsNumber()
  @Min(0)
  precioVentaProd!: number;

  @Transform(({ value }) => toRequiredNumber(value))
  @IsNumber()
  @Min(0)
  ivaProd!: number;

  @Transform(({ value }) => toRequiredNumber(value))
  @IsNumber()
  @Min(0)
  dctoPromoProd!: number;

  /**
   * Compatibilidad temporal con el frontend.
   *
   * El repository ignora cualquier cambio enviado aquí.
   */
  @IsOptional()
  @Transform(({ value }) => optionalInt(value))
  @IsInt()
  @Min(0)
  stockProd?: number;

  @IsOptional()
  @Transform(({ value }) => optionalInt(value))
  @IsInt()
  @Min(0)
  stockMinimoProd?: number;

  /**
   * La disponibilidad será recalculada desde el stock real.
   */
  @IsOptional()
  @IsIn(['si', 'no'])
  disponibleProd?: 'si' | 'no';

  @IsEnum(EnumEstadosProducto)
  estadoProd!: EnumEstadosProducto;

  @IsOptional()
  @IsString()
  @Length(1, 250)
  @Transform(({ value }) => optionalLowerText(value))
  descripcionProd?: string | null;
}
