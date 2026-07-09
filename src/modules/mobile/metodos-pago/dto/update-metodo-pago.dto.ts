import { Transform } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
  IsIn,
} from 'class-validator';

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

function optionalLowerString(value: unknown): string | undefined | unknown {
  const text = optionalString(value);

  return typeof text === 'string' ? text.toLowerCase() : text;
}

export class UpdateMetodoPagoDto {
  /**
   * Opcional porque el controller lo toma de Param(':id').
   */
  @IsOptional()
  @Transform(({ value }) => optionalInt(value))
  @IsInt()
  @Min(0)
  ideMetoPago?: number;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  @Transform(({ value }) => optionalLowerString(value))
  nombreTitular?: string;

  @IsOptional()
  @IsString()
  @Length(1, 7)
  @Transform(({ value }) => optionalString(value))
  fechaExpiracion?: string;

  @IsOptional()
  @IsString()
  @IsIn(['si', 'no'])
  esPredeterminado?: 'si' | 'no';

  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Transform(({ value }) => optionalLowerString(value))
  alias?: string;

  /**
   * Opcional porque el controller lo asigna desde el JWT.
   */
  @IsOptional()
  @IsString()
  @Length(1, 25)
  @Transform(({ value }) => optionalString(value))
  usuaActua?: string;
}
