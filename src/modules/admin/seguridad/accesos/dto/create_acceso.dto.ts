import { Transform } from 'class-transformer';
import {
  IsDateString,
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

function optionalNumberOrNull(value: unknown): number | null | unknown {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const numberValue = Number(value);

  if (Number.isFinite(numberValue)) {
    return numberValue;
  }

  return value;
}

export class CreateAccesoUsuarioDto {
  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(0)
  ideCuen!: number;

  @IsString()
  @Length(1, 250)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : null,
  )
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
  @IsString()
  @Length(1, 15)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined,
  )
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
