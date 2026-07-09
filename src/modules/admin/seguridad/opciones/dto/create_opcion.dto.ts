import { Transform } from 'class-transformer';
import {
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

export class CreateOpcionDto {
  @IsString()
  @Length(1, 100)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : null,
  )
  nombreOpci!: string;

  @IsString()
  @Length(1, 500)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : null,
  )
  rutaOpci!: string;

  @IsIn(['si', 'no'])
  activoOpci!: 'si' | 'no';

  @IsOptional()
  @IsString()
  @Length(1, 250)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : null,
  )
  descripcionOpci?: string | null;

  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(0)
  nivelOpci!: number;

  @IsOptional()
  @Transform(({ value }) => optionalIntOrNull(value))
  @IsInt()
  @Min(0)
  padreOpci?: number | null;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : null,
  )
  iconoOpci?: string | null;
}
