import { IsOptional, IsInt, IsString, Min, Max, IsEnum, IsNumber, Length } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { EnumEstadosCuenta, IFiltroCuenta } from '@models';
import { isIntNumeric } from '@helpers/utilities';

export class FiltroCuentaDto implements IFiltroCuenta {

  @IsOptional()
  @Transform(({value}) => isIntNumeric(value) ? (+value) : null )
  @IsInt()
  @Min(0)
  ideEmpl?: number;

  @IsOptional()
  @Transform(({value}) => isIntNumeric(value) ? (+value) : null )
  @IsInt()
  @Min(0)
  idePerf?: number;

  @IsOptional()
  @IsString()
  @Length(1, 25)
  usuarioCuen?: string;

  @IsOptional()
  @IsEnum(EnumEstadosCuenta)
  estadoCuen?: EnumEstadosCuenta;

  toArray(): any[] {
    return [
      this.ideEmpl?? null,
      this.idePerf?? null,
      this.usuarioCuen?? null,
      this.estadoCuen?? null
    ]
  }

}