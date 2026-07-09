import { EnumMotivosPedido } from '@models';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

function optionalString(value: unknown): string | undefined | unknown {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === 'string') {
    const text = value.trim();
    return text !== '' ? text : undefined;
  }

  return value;
}

export class FilterPedidoDTO {
  @IsOptional()
  @IsString()
  @Length(1, 250)
  @Transform(({ value }) => optionalString(value))
  nombreEmpr?: string;

  @IsOptional()
  @IsIn(['progreso', 'completado', 'incompleto', 'emitido'])
  estadoPedi?: 'progreso' | 'completado' | 'incompleto' | 'emitido';

  @IsOptional()
  @IsEnum(EnumMotivosPedido)
  motivoPedi?: EnumMotivosPedido;

  @IsOptional()
  @Transform(({ value }) => optionalString(value))
  @IsDateString()
  fechaPedi?: string;

  @IsOptional()
  @Transform(({ value }) => optionalString(value))
  @IsDateString()
  fechaEntrPedi?: string;
}
