import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
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

function optionalIntOrNull(value: unknown): number | null | unknown {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const numberValue = Number(value);

  if (Number.isInteger(numberValue)) {
    return numberValue;
  }

  return value;
}

function optionalBoolean(value: unknown): boolean | undefined | unknown {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const text = value.trim().toLowerCase();

    if (['true', '1', 'si', 'sí'].includes(text)) {
      return true;
    }

    if (['false', '0', 'no'].includes(text)) {
      return false;
    }
  }

  return value;
}

export class FilterOpcionDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined,
  )
  nombreOpci?: string;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined,
  )
  rutaOpci?: string;

  @IsOptional()
  @IsIn(['si', 'no'])
  activoOpci?: 'si' | 'no';

  @IsOptional()
  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(0)
  nivelOpci?: number;

  @IsOptional()
  @Transform(({ value }) => optionalIntOrNull(value))
  @IsInt()
  @Min(0)
  padreOpci?: number;

  @IsOptional()
  @Transform(({ value }) => optionalBoolean(value))
  @IsBoolean()
  visibleOpci?: boolean;
}
