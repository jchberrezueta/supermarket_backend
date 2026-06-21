import { Transform, Type } from 'class-transformer';
import { IsInt, IsString, Length, Min } from 'class-validator';

export class UpdateCategoriaDTO {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  ideCate!: number;

  @IsString()
  @Length(1, 100)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== ''
      ? value.trim().toLowerCase()
      : null,
  )
  nombreCate!: string;

  @IsString()
  @Length(1, 250)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== ''
      ? value.trim().toLowerCase()
      : 'ninguna',
  )
  descripcionCate!: string;
}
