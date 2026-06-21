import { isIntNumeric } from '@helpers/utilities';
import { Transform } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class FilterEmpleadoDTO {
  @IsOptional()
  @Transform(({ value }) => (isIntNumeric(value) ? Number(value) : null))
  @IsInt()
  @Min(0)
  ideRol?: number;

  @IsOptional()
  @IsNumberString()
  @Length(7, 15)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : null,
  )
  cedulaEmpl?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : null,
  )
  primerNombreEmpl?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : null,
  )
  apellidoPaternoEmpl?: string;

  @IsOptional()
  @IsString()
  @Length(1, 250)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : null,
  )
  tituloEmpl?: string;

  @IsOptional()
  @IsIn(['activo', 'inactivo'])
  estadoEmpl?: 'activo' | 'inactivo';
}
