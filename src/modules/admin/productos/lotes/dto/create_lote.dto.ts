import { Transform } from 'class-transformer';
import { IsDateString, IsIn, IsInt, Min } from 'class-validator';

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

export class CreateLoteDTO {
  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(0)
  ideProd!: number;

  @IsDateString()
  fechaCaducidadLote!: string;

  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(0)
  stockLote!: number;

  @IsIn(['correcto', 'proximo', 'caducado', 'devuelto'])
  estadoLote!: 'correcto' | 'proximo' | 'caducado' | 'devuelto';
}
