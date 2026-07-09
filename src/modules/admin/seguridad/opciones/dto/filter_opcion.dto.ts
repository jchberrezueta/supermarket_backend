import { Transform } from 'class-transformer';
import { IsIn, IsOptional, IsString, Length } from 'class-validator';

export class FilterOpcionDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined,
  )
  nombreOpci?: string;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined,
  )
  rutaOpci?: string;

  @IsOptional()
  @IsIn(['si', 'no'])
  activoOpci?: 'si' | 'no';
}
