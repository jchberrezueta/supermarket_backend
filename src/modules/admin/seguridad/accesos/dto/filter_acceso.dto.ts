import { isIntNumeric } from '@helpers/utilities';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class FilterAccesoUsuarioDto {
  @IsOptional()
  @Transform(({ value }) => (isIntNumeric(value) ? Number(value) : null))
  @IsInt()
  @Min(0)
  ideCuen?: number;

  @IsOptional()
  @IsString()
  @Length(1, 15)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : null,
  )
  ipAcce?: string;

  @IsOptional()
  @IsString()
  @Length(1, 250)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : null,
  )
  navegadorAcce?: string;

  @IsOptional()
  @IsDateString()
  fechaAcceDesde?: string;

  @IsOptional()
  @IsDateString()
  fechaAcceHasta?: string;
}
