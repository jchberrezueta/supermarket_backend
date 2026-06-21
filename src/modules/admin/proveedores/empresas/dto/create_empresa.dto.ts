import { EnumEstadosEmpresa } from '@models';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNumberString,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateEmpresaDTO {
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
