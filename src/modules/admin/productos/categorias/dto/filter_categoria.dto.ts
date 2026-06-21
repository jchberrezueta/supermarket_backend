import { Transform } from 'class-transformer';
import { IsOptional, IsString, Length } from 'class-validator';

export class FilterCategoriaDTO {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : null,
  )
  nombreCate?: string;

  @IsOptional()
  @IsString()
  @Length(1, 250)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : null,
  )
  descripcionCate?: string;
}
