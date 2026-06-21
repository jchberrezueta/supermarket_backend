import { isIntNumeric } from '@helpers/utilities';
import { EnumEstadosCuenta } from '@models';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class FiltroCuentaDto {
  @IsOptional()
  @Transform(({ value }) => (isIntNumeric(value) ? Number(value) : null))
  @IsInt()
  @Min(0)
  ideEmpl?: number;

  @IsOptional()
  @Transform(({ value }) => (isIntNumeric(value) ? Number(value) : null))
  @IsInt()
  @Min(0)
  idePerf?: number;

  @IsOptional()
  @IsString()
  @Length(1, 25)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : null,
  )
  usuarioCuen?: string;

  @IsOptional()
  @IsEnum(EnumEstadosCuenta)
  estadoCuen?: EnumEstadosCuenta;
}
