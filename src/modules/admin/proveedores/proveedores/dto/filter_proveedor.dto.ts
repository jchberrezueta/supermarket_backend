import { isIntNumeric } from '@helpers/utilities';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class FilterProveedorDTO {
  @IsOptional()
  @Transform(({ value }) => (isIntNumeric(value) ? Number(value) : null))
  @IsInt()
  @Min(0)
  ideEmpr?: number;

  @IsOptional()
  @IsNumberString()
  @Length(7, 15)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : null,
  )
  cedulaProv?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : null,
  )
  primerNombreProv?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : null,
  )
  apellidoPaternoProv?: string;

  @IsOptional()
  @IsEmail()
  @Length(1, 100)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== ''
      ? value.trim().toLowerCase()
      : null,
  )
  emailProv?: string;
}
