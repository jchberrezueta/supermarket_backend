import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  Min,
} from 'class-validator';

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

function optionalNumberOrNull(value: unknown): number | null | unknown {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : value;
}

function optionalTrimmedString(value: unknown): string | undefined | unknown {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (typeof value !== 'string') {
    return value;
  }

  const result = value.trim();

  return result === '' ? undefined : result;
}

export class CreateAccesoUsuarioDto {
  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(1)
  ideCuen!: number;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Length(1, 250)
  navegadorAcce!: string;

  @IsOptional()
  @IsDateString()
  fechaAcce?: string;

  @IsOptional()
  @Transform(({ value }) => optionalInt(value))
  @IsInt()
  @Min(0)
  numIntFallAcce?: number;

  @IsOptional()
  @Transform(({ value }) => optionalTrimmedString(value))
  @IsString()
  @MaxLength(45)
  ipAcce?: string;

  @IsOptional()
  @Transform(({ value }) => optionalNumberOrNull(value))
  @IsNumber()
  latitudAcce?: number | null;

  @IsOptional()
  @Transform(({ value }) => optionalNumberOrNull(value))
  @IsNumber()
  longitudAcce?: number | null;
}
