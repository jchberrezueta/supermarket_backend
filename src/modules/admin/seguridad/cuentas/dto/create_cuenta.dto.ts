import { EnumEstadosCuenta, ICuenta } from '@models';
import { IsString, Equals, IsInt, Min, IsEnum, Length } from 'class-validator';

export class CreateCuentaDto implements ICuenta {

  @IsInt()
  @Equals(-1)
  ideCuen: number;

  @IsInt()
  @Min(0)
  ideEmpl: number;

  @IsInt()
  @Min(0)
  idePerf: number;

  @IsString()
  @Length(1, 25)
  usuarioCuen: string;

  @IsString()
  passwordCuen: string;

  @IsEnum(EnumEstadosCuenta)
  estadoCuen: EnumEstadosCuenta;

  toArray(): any[] {
    return [
      this.ideEmpl,
      this.idePerf,
      this.usuarioCuen,
      this.passwordCuen,
      this.estadoCuen
    ]
  }
}