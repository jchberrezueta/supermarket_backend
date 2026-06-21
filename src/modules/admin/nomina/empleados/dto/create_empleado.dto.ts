import { Transform, Type } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class CreateEmpleadoDTO {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  ideRol!: number;

  @IsNumberString()
  @Length(7, 15)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : null,
  )
  cedulaEmpl!: string;

  @IsDateString()
  fechaNacimientoEmpl!: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  edadEmpl!: number;

  @IsDateString()
  fechaInicioEmpl!: string;

  @IsString()
  @Length(1, 50)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== ''
      ? value.trim().toLowerCase()
      : null,
  )
  primerNombreEmpl!: string;

  @IsString()
  @Length(1, 50)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== ''
      ? value.trim().toLowerCase()
      : null,
  )
  apellidoPaternoEmpl!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  rmuEmpl!: number;

  @IsString()
  @Length(1, 250)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== ''
      ? value.trim().toLowerCase()
      : 'libre',
  )
  tituloEmpl!: string;

  @IsIn(['activo', 'inactivo'])
  estadoEmpl!: 'activo' | 'inactivo';

  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== ''
      ? value.trim().toLowerCase()
      : null,
  )
  segundoNombreEmpl?: string | null;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== ''
      ? value.trim().toLowerCase()
      : null,
  )
  apellidoMaternoEmpl?: string | null;

  @IsOptional()
  @Transform(({ value }) =>
    value === null || value === undefined || String(value).trim() === ''
      ? null
      : value,
  )
  @IsDateString()
  fechaTerminoEmpl?: string | null;
}
