import { isIntNumeric } from '@helpers/utilities';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class FilterEntregaDetalleDTO {
  @IsOptional()
  @Transform(({ value }) => (isIntNumeric(value) ? Number(value) : null))
  @IsInt()
  @Min(0)
  ideEntr?: number;

  @IsOptional()
  @Transform(({ value }) => (isIntNumeric(value) ? Number(value) : null))
  @IsInt()
  @Min(0)
  ideProd?: number;
}
