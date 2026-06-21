import { isIntNumeric } from '@helpers/utilities';
import { Transform } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class FilterProductoDTO {
  @IsOptional()
  @Transform(({ value }) => (isIntNumeric(value) ? Number(value) : null))
  @IsInt()
  @Min(0)
  ideCate?: number;

  @IsOptional()
  @Transform(({ value }) => (isIntNumeric(value) ? Number(value) : null))
  @IsInt()
  @Min(0)
  ideMarc?: number;

  @IsOptional()
  @IsString()
  @Length(1, 30)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : null,
  )
  codigoBarraProd?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : null,
  )
  nombreProd?: string;

  @IsOptional()
  @IsIn(['si', 'no'])
  disponibleProd?: 'si' | 'no';

  @IsOptional()
  @IsIn(['activo', 'inactivo'])
  estadoProd?: 'activo' | 'inactivo';
}
