import { isIntNumeric } from '@helpers/utilities';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Length, Max, Min } from 'class-validator';

export class FilterMarcaDTO {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : null,
  )
  nombreMarc?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : null,
  )
  paisOrigenMarc?: string;

  @IsOptional()
  @Transform(({ value }) => (isIntNumeric(value) ? Number(value) : null))
  @IsInt()
  @Min(1)
  @Max(10)
  calidadMarc?: number;
}
