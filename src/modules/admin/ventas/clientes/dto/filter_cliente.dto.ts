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
  @Length(1, 15)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined,
  )
  cedulaClie?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined,
  )
  primerNombreClie?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined,
  )
  apellidoPaternoClie?: string;

  @IsOptional()
  @IsString()
  @Length(1, 250)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined,
  )
  nombreCompletoClie?: string;

  @IsOptional()
  @IsIn(['si', 'no'])
  esSocio?: 'si' | 'no';

  @IsOptional()
  @IsIn(['si', 'no'])
  esTerceraEdad?: 'si' | 'no';
}
