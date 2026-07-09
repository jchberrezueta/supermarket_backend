import { Transform } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

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

export class ItemVentaPosDto {
  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(0)
  ideProd!: number;

  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(1)
  cantidad!: number;
}
