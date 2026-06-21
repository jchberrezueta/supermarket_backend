import { Transform, Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsIn,
  IsInt,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class CreateClienteDTO {
  @IsNumberString()
  @Length(7, 15)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : null,
  )
  cedulaClie!: string;

  @IsDateString()
  fechaNacimientoClie!: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  edadClie!: number;

  @IsNumberString()
  @Length(7, 15)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : null,
  )
  telefonoClie!: string;

  @IsString()
  @Length(1, 50)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== ''
      ? value.trim().toLowerCase()
      : null,
  )
  primerNombreClie!: string;

  @IsString()
  @Length(1, 50)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== ''
      ? value.trim().toLowerCase()
      : null,
  )
  apellidoPaternoClie!: string;

  @IsEmail()
  @Length(1, 100)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== ''
      ? value.trim().toLowerCase()
      : null,
  )
  emailClie!: string;

  @IsIn(['si', 'no'])
  esSocio!: 'si' | 'no';

  @IsIn(['si', 'no'])
  esTerceraEdad!: 'si' | 'no';

  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== ''
      ? value.trim().toLowerCase()
      : null,
  )
  segundoNombreClie?: string | null;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== ''
      ? value.trim().toLowerCase()
      : null,
  )
  apellidoMaternoClie?: string | null;
}
