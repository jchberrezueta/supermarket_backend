import { isIntNumeric } from '@helpers/utilities';
import { EnumEstadoVenta } from '@models';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class FilterVentaDTO {
  @IsOptional()
  @Transform(({ value }) => (isIntNumeric(value) ? Number(value) : null))
  @IsInt()
  @Min(0)
  ideEmpl?: number;

  @IsOptional()
  @Transform(({ value }) => (isIntNumeric(value) ? Number(value) : null))
  @IsInt()
  @Min(0)
  ideClie?: number;

  @IsOptional()
  @IsString()
  @Length(1, 25)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : null,
  )
  numFacturaVent?: string;

  @IsOptional()
  @IsEnum(EnumEstadoVenta)
  estadoVent?: EnumEstadoVenta;

  @IsOptional()
  @IsDateString()
  fechaDesde?: string;

  @IsOptional()
  @IsDateString()
  fechaHasta?: string;
}
