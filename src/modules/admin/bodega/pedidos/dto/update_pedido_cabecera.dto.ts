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

export class UpdatePedidoCabeceraDTO {
  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(1)
  idePedi!: number;

  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(1)
  ideEmpr!: number;

  @IsDateString()
  fechaPedi!: string;

  @IsDateString()
  fechaEntrPedi!: string;

  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(1)
  cantidadTotalPedi!: number;

  @Transform(({ value }) => toRequiredNumber(value))
  @IsNumber()
  @Min(0)
  totalPedi!: number;

  /**
   * Actualizar no cambia formalmente el estado.
   * El service conservará siempre el borrador.
   */
  @IsOptional()
  @IsEnum(EnumEstadosPedido)
  estadoPedi: EnumEstadosPedido = EnumEstadosPedido.BORRADOR;

  @IsEnum(EnumMotivosPedido)
  motivoPedi!: EnumMotivosPedido;

  @IsOptional()
  @IsString()
  @Length(1, 250)
  @Transform(({ value }) => optionalText(value))
  observacionPedi?: string | null;
}
