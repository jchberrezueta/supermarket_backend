import { isIntNumeric } from '@helpers/utilities';
import { Transform, Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class CreateOpcionDto {
  @IsString()
  @Length(1, 100)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : null,
  )
  nombreOpci!: string;

  @IsString()
  @Length(1, 500)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : null,
  )
  rutaOpci!: string;

  @IsIn(['si', 'no'])
  activoOpci!: 'si' | 'no';

  @IsString()
  @Length(1, 250)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : 'ninguna',
  )
  descripcionOpci!: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  nivelOpci!: number;

  @IsOptional()
  @Transform(({ value }) =>
    value === null || value === undefined || String(value).trim() === ''
      ? null
      : isIntNumeric(value)
        ? Number(value)
        : value,
  )
  @IsInt()
  @Min(0)
  padreOpci?: number | null;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : null,
  )
  iconoOpci?: string | null;
}
