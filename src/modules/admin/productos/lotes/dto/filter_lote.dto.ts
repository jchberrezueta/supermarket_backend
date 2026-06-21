import { isIntNumeric } from '@helpers/utilities';
import { Transform } from 'class-transformer';
import { IsDateString, IsIn, IsInt, IsOptional, Min } from 'class-validator';

export class FilterLoteDTO {
  @IsOptional()
  @Transform(({ value }) => (isIntNumeric(value) ? Number(value) : null))
  @IsInt()
  @Min(0)
  ideLote?: number;

  @IsOptional()
  @Transform(({ value }) => (isIntNumeric(value) ? Number(value) : null))
  @IsInt()
  @Min(1)
  ideProd?: number;

  @IsOptional()
  @IsDateString()
  fechaCaducidadLoteDesde?: string;

  @IsOptional()
  @IsDateString()
  fechaCaducidadLoteHasta?: string;

  @IsOptional()
  @Transform(({ value }) => (isIntNumeric(value) ? Number(value) : null))
  @IsInt()
  @Min(0)
  stockLoteMin?: number;

  @IsOptional()
  @Transform(({ value }) => (isIntNumeric(value) ? Number(value) : null))
  @IsInt()
  @Min(0)
  stockLoteMax?: number;

  @IsOptional()
  @IsIn(['correcto', 'proximo', 'caducado', 'devuelto'])
  estadoLote?: 'correcto' | 'proximo' | 'caducado' | 'devuelto';
}
