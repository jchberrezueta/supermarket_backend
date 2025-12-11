import { 
  IsString, 
  IsDateString, 
  IsEnum, 
  Length,
  IsNumberString,
  IsInt,
  Min,
  IsNumber,
  Equals,
  IsOptional
} from 'class-validator';
import { Transform } from 'class-transformer';
import { EnumEstadoEmpleado, IEmpleado } from '@models';

export class CreateEmpleadoDTO implements IEmpleado {

  @IsInt()
  @Equals(-1)
  ideEmpl: number;

  @IsInt()
  @Min(0)
  ideRol: number;

  @IsNumberString()
  @Length(7, 15)
  @Transform(({ value }) =>
    (typeof value === 'string' && value.trim() !== '') ? value.trim().toLowerCase() : null
  )
  cedulaEmpl: string;

  @IsDateString()
  fechaNacimientoEmpl: string;

  @IsInt()
  @Min(18)
  edadEmpl: number;

  @IsDateString()
  fechaInicioEmpl: string;

  @IsString()
  @Length(1, 50)
  @Transform(({ value }) =>
    (typeof value === 'string' && value.trim() !== '') ? value.trim().toLowerCase() : null
  )
  primerNombreEmpl: string;

  @IsString()
  @Length(1, 50)
  @Transform(({ value }) =>
    (typeof value === 'string' && value.trim() !== '') ? value.trim().toLowerCase() : null
  )
  apellidoPaternoEmpl: string;

  @IsNumber()
  @Min(1)
  rmuEmpl: number;
  
  @IsString()
  @Length(1, 250)
  @Transform(({ value }) =>
    (typeof value === 'string' && value.trim() !== '') ? value.trim().toLowerCase() : 'libre'
  )
  tituloEmpl: string;

  @IsEnum(EnumEstadoEmpleado)
  estadoEmpl: EnumEstadoEmpleado;

  @IsOptional()
  @IsString()
  @Length(0, 50)
  @Transform(({ value }) =>
    (typeof value === 'string' && value.trim() !== '') ? value.trim().toLowerCase() : null
  )
  segundoNombreEmpl?: string | null;

  @IsOptional()
  @IsString()
  @Length(0, 50)
  @Transform(({ value }) =>
    (typeof value === 'string' && value.trim() !== '') ? value.trim().toLowerCase() : null
  )
  apellidoMaternoEmpl?: string | null;

  @IsOptional()
  @IsDateString()
  @Transform(({ value }) =>
    (typeof value === 'string' && value.trim() !== '') ? value.trim() : null
  )
  fechaTerminoEmpl?: string | null;

  toArray(): any[] {
    return [
        this.ideRol,
        this.cedulaEmpl,
        this.fechaNacimientoEmpl,
        this.edadEmpl,
        this.fechaInicioEmpl,
        this.primerNombreEmpl,
        this.apellidoPaternoEmpl,
        this.rmuEmpl,
        this.tituloEmpl,
        this.estadoEmpl,
        this.segundoNombreEmpl ?? null,
        this.apellidoPaternoEmpl ?? null,
        this.fechaTerminoEmpl ?? null
    ]
  }
}
