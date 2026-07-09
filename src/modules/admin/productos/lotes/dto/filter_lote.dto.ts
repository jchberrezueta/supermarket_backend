import { Transform } from 'class-transformer';
import { IsDateString, IsIn, IsInt, IsOptional, Min } from 'class-validator';

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

export class FilterLoteDTO {
  @IsOptional()
  @Transform(({ value }) => optionalInt(value))
  @IsInt()
  @Min(0)
  ideLote?: number;

  @IsOptional()
  @Transform(({ value }) => optionalInt(value))
  @IsInt()
  @Min(0)
  ideProd?: number;

  @IsOptional()
  @IsDateString()
  fechaCaducidadLoteDesde?: string;

  @IsOptional()
  @IsDateString()
  fechaCaducidadLoteHasta?: string;

  @IsOptional()
  @Transform(({ value }) => optionalInt(value))
  @IsInt()
  @Min(0)
  stockLoteMin?: number;

  @IsOptional()
  @Transform(({ value }) => optionalInt(value))
  @IsInt()
  @Min(0)
  stockLoteMax?: number;

  @IsOptional()
  @IsIn(['correcto', 'proximo', 'caducado', 'devuelto'])
  estadoLote?: 'correcto' | 'proximo' | 'caducado' | 'devuelto';
}
