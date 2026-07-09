import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsIn,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

function optionalString(value: unknown): string | undefined | unknown {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === 'string') {
    const text = value.trim();
    return text !== '' ? text : undefined;
  }

  return value;
}

function optionalLowerString(value: unknown): string | undefined | unknown {
  const text = optionalString(value);

  return typeof text === 'string' ? text.toLowerCase() : text;
}

export class UpdateClienteDto {
  @IsOptional()
  @IsNumberString()
  @Length(7, 15)
  @Transform(({ value }) => optionalString(value))
  cedulaClie?: string;

  @IsOptional()
  @Transform(({ value }) => optionalString(value))
  @IsDateString()
  fechaNacimientoClie?: string;

  @IsOptional()
  @IsNumberString()
  @Length(7, 15)
  @Transform(({ value }) => optionalString(value))
  telefonoClie?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Transform(({ value }) => optionalLowerString(value))
  primerNombreClie?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Transform(({ value }) => optionalLowerString(value))
  apellidoPaternoClie?: string;

  @IsOptional()
  @IsEmail()
  @Length(1, 100)
  @Transform(({ value }) => optionalLowerString(value))
  emailClie?: string;

  @IsOptional()
  @IsString()
  @IsIn(['si', 'no'])
  esSocio?: 'si' | 'no';

  @IsOptional()
  @IsString()
  @IsIn(['si', 'no'])
  esTerceraEdad?: 'si' | 'no';

  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Transform(({ value }) => optionalLowerString(value))
  segundoNombreClie?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Transform(({ value }) => optionalLowerString(value))
  apellidoMaternoClie?: string;
}
