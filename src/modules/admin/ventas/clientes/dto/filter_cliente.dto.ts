import { Transform } from 'class-transformer';
import {
  IsIn,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class FilterClienteDTO {
  @IsOptional()
  @IsNumberString()
  @Length(7, 15)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : null,
  )
  cedulaClie?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : null,
  )
  primerNombreClie?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : null,
  )
  apellidoPaternoClie?: string;

  @IsOptional()
  @IsIn(['si', 'no'])
  esSocio?: 'si' | 'no';

  @IsOptional()
  @IsIn(['si', 'no'])
  esTerceraEdad?: 'si' | 'no';
}
