import { EnumEstadosCuenta } from '@models';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsString, Length, Min } from 'class-validator';

export class CreateCuentaDto {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  ideEmpl!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  idePerf!: number;

  @IsString()
  @Length(1, 25)
  usuarioCuen!: string;

  @IsString()
  @Length(1, 250)
  passwordCuen!: string;

  @IsEnum(EnumEstadosCuenta)
  estadoCuen!: EnumEstadosCuenta;
}
