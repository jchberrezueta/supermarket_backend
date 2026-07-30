import { EnumEstadoProveedor } from '@models';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

function optionalInt(value: unknown): number | undefined | unknown {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }

  const numberValue = Number(value);

  if (Number.isInteger(numberValue)) {
    return numberValue;
  }

  return value;
}

function optionalString(value: unknown): string | undefined | unknown {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (typeof value !== 'string') {
    return value;
  }

  const text = value.trim();

  return text !== '' ? text : undefined;
}

function optionalLowerString(value: unknown): string | undefined | unknown {
  if (value === null || value === undefined) {
    return undefined;
  }
  if (typeof value !== 'string') {
    return value;
  }

  const text = value.trim();
  return text !== '' ? text.toLowerCase() : undefined;
}

export class FilterProveedorDTO {
  @IsOptional()
  @Transform(({ value }) => optionalInt(value))
  @IsInt()
  @Min(0)
  ideEmpr?: number;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Transform(({ value }) => optionalString(value))
  nombreEmp?: string;

  @IsOptional()
  @IsNumberString()
  @Length(1, 15)
  @Transform(({ value }) => optionalString(value))
  cedulaProv?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Transform(({ value }) => optionalString(value))
  primerNombreProv?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Transform(({ value }) => optionalString(value))
  apellidoPaternoProv?: string;

  @IsOptional()
  @IsString()
  @Length(1, 250)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined,
  )
  nombreCompletoProv?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  @Transform(({ value }) => optionalLowerString(value))
  emailProv?: string;

  @IsOptional()
  @IsEnum(EnumEstadoProveedor)
  estadoProv?: EnumEstadoProveedor;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Transform(({ value }) => optionalLowerString(value))
  cargoProv?: string;
}
