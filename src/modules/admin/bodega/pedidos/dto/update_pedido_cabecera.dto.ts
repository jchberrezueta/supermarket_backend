import { EnumEstadosPedido, EnumMotivosPedido } from '@models';
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

function optionalText(value: unknown): string | null | unknown {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'string') {
    const text = value.trim();
    return text !== '' ? text.toLowerCase() : null;
  }

  return value;
}

export class UpdatePedidoCabeceraDTO {
  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(0)
  idePedi!: number;

  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(0)
  ideEmpr!: number;

  @IsDateString()
  fechaPedi!: string;

  @IsDateString()
  fechaEntrPedi!: string;

  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(0)
  cantidadTotalPedi!: number;

  @Transform(({ value }) => toRequiredNumber(value))
  @IsNumber()
  @Min(0)
  totalPedi!: number;

  @IsEnum(EnumEstadosPedido)
  estadoPedi!: EnumEstadosPedido;

  @IsEnum(EnumMotivosPedido)
  motivoPedi!: EnumMotivosPedido;

  @IsOptional()
  @IsString()
  @Length(1, 250)
  @Transform(({ value }) => optionalText(value))
  observacionPedi?: string | null;
}
