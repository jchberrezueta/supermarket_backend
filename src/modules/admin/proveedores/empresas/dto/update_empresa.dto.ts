import { EnumEstadosEmpresa } from '@models';
import { Transform, Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsNumberString,
  IsString,
  Length,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateEmpresaDTO {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  ideEmp!: number;

  @IsString()
  @Length(1, 250)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== ''
      ? value.trim().toLowerCase()
      : null,
  )
  nombreEmp!: string;

  @IsString()
  @Length(1, 250)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== ''
      ? value.trim().toLowerCase()
      : null,
  )
  responsableEmp!: string;

  @IsDateString()
  fechaContratoEmp!: string;

  @IsString()
  @Length(1, 250)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== ''
      ? value.trim().toLowerCase()
      : null,
  )
  direccionEmp!: string;

  @IsNumberString()
  @Length(7, 15)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : null,
  )
  telefonoEmp!: string;

  @IsEmail()
  @MaxLength(100)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== ''
      ? value.trim().toLowerCase()
      : null,
  )
  emailEmp!: string;

  @IsEnum(EnumEstadosEmpresa)
  estadoEmp!: EnumEstadosEmpresa;

  @IsString()
  @Length(1, 250)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== ''
      ? value.trim().toLowerCase()
      : 'ninguna',
  )
  descripcionEmp!: string;
}
