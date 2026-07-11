import { EnumEstadoEntrega } from '@models';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

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

export class CreateEntregaCabeceraDTO {
  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(0)
  idePedi!: number;

  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(0)
  ideProv!: number;

  @IsDateString()
  fechaEntr!: string;

  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(0)
  cantidadTotalEntr!: number;

  @Transform(({ value }) => toRequiredNumber(value))
  @IsNumber()
  @Min(0)
  totalEntr!: number;

  /**
   * El backend siempre fuerza borrador al crear.
   * Se mantiene opcional para no romper el frontend existente.
   */
  @IsOptional()
  @IsEnum(EnumEstadoEntrega)
  estadoEntr: EnumEstadoEntrega = EnumEstadoEntrega.BORRADOR;

  @IsOptional()
  @IsString()
  @Length(1, 250)
  @Transform(({ value }) => optionalText(value))
  observacionEntr?: string | null;
}
