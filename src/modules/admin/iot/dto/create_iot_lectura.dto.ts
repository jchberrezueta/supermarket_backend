import { Transform } from 'class-transformer';
import { IsNumber, IsString, Length, Max, Min } from 'class-validator';

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

function requiredUpperString(value: unknown): string | null | unknown {
  if (typeof value === 'string' && value.trim() !== '') {
    return value.trim().toUpperCase();
  }

  return null;
}

export class CreateIotLecturaDto {
  @IsString()
  @Length(1, 50)
  @Transform(({ value }) => requiredUpperString(value))
  codigoDispositivo!: string;

  @Transform(({ value }) => toRequiredNumber(value))
  @IsNumber()
  @Min(-40)
  @Max(80)
  temperatura!: number;

  @Transform(({ value }) => toRequiredNumber(value))
  @IsNumber()
  @Min(0)
  @Max(100)
  humedad!: number;
}
