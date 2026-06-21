import { Transform, Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsInt,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class CreateProveedorDTO {
  @Type(() => Number)
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

  @Type(() => Number)
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
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== ''
      ? value.trim().toLowerCase()
      : null,
  )
  emailProv!: string;

  @IsString()
  @Length(1, 50)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== ''
      ? value.trim().toLowerCase()
      : null,
  )
  primerNombreProv!: string;

  @IsString()
  @Length(1, 50)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== ''
      ? value.trim().toLowerCase()
      : null,
  )
  apellidoPaternoProv!: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== ''
      ? value.trim().toLowerCase()
      : null,
  )
  segundoNombreProv?: string | null;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== ''
      ? value.trim().toLowerCase()
      : null,
  )
  apellidoMaternoProv?: string | null;
}
