import { EnumEstadoProveedor } from '@models';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

function toRequiredInt(value: unknown): number | unknown {
  if (value === null || value === undefined || value === '') {
    return value;
  }

  const numberValue = Number(value);

  if (Number.isInteger(numberValue)) {
    return numberValue;
  }

  return value;
}

function requiredLowerText(value: unknown): string | null | unknown {
  if (typeof value !== 'string') {
    return value;
  }

  const text = value.trim();

  return text !== '' ? text.toLowerCase() : null;
}

function optionalLowerText(value: unknown): string | null | unknown {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value !== 'string') {
    return value;
  }

  const text = value.trim();

  return text !== '' ? text.toLowerCase() : null;
}

function optionalText(value: unknown): string | null | unknown {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value !== 'string') {
    return value;
  }

  const text = value.trim();

  return text !== '' ? text.toLowerCase() : null;
}

export class CreateProveedorDTO {
  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(0)
  ideEmpr!: number;

  @IsNumberString()
  @Length(7, 15)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : null,
  )
  cedulaProv!: string;

  @IsDateString()
  fechaNacimientoProv!: string;

  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(1)
  edadProv!: number;

  @IsNumberString()
  @Length(7, 15)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : null,
  )
  telefonoProv!: string;

  @IsEmail()
  @Length(1, 100)
  @Transform(({ value }) => requiredLowerText(value))
  emailProv!: string;

  @IsString()
  @Length(1, 50)
  @Transform(({ value }) => requiredLowerText(value))
  primerNombreProv!: string;

  @IsString()
  @Length(1, 50)
  @Transform(({ value }) => requiredLowerText(value))
  apellidoPaternoProv!: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Transform(({ value }) => optionalLowerText(value))
  segundoNombreProv?: string | null;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Transform(({ value }) => optionalLowerText(value))
  apellidoMaternoProv?: string | null;

  @IsOptional()
  @IsEnum(EnumEstadoProveedor)
  estadoProv?: EnumEstadoProveedor;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Transform(({ value }) => optionalText(value))
  cargoProv?: string | null;
}
