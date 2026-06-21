import { EnumEstadosCuenta } from '@models';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
  ValidateIf,
} from 'class-validator';

export class UpdateCuentaDto {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  ideCuen!: number;

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

  /**
   * En actualización la contraseña es opcional:
   * - si viene vacía, se conserva la clave actual
   * - si viene con valor, el service la encripta
   */
  @IsOptional()
  @ValidateIf(
    (_, value) =>
      value !== undefined && value !== null && String(value).trim() !== '',
  )
  @IsString()
  @Length(1, 250)
  passwordCuen?: string;

  @IsEnum(EnumEstadosCuenta)
  estadoCuen!: EnumEstadosCuenta;
}
