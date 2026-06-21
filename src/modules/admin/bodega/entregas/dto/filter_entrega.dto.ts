import { isIntNumeric } from '@helpers/utilities';
import { EnumEstadoEntrega } from '@models';
import { Transform } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsOptional, Min } from 'class-validator';

export class FilterEntregaDTO {
  @IsOptional()
  @Transform(({ value }) => (isIntNumeric(value) ? Number(value) : null))
  @IsInt()
  @Min(0)
  idePedi?: number;

  @IsOptional()
  @Transform(({ value }) => (isIntNumeric(value) ? Number(value) : null))
  @IsInt()
  @Min(0)
  ideProv?: number;

  @IsOptional()
  @IsEnum(EnumEstadoEntrega)
  estadoEntr?: EnumEstadoEntrega;

  @IsOptional()
  @IsDateString()
  fechaDesde?: string;

  @IsOptional()
  @IsDateString()
  fechaHasta?: string;
}
