import { Transform, Type } from 'class-transformer';
import { IsInt, IsString, Length, Max, Min } from 'class-validator';

export class UpdateMarcaDTO {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  ideMarc!: number;

  @IsString()
  @Length(1, 100)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== ''
      ? value.trim().toLowerCase()
      : null,
  )
  nombreMarc!: string;

  @IsString()
  @Length(1, 100)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== ''
      ? value.trim().toLowerCase()
      : null,
  )
  paisOrigenMarc!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10)
  calidadMarc!: number;

  @IsString()
  @Length(1, 250)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== ''
      ? value.trim().toLowerCase()
      : 'ninguna',
  )
  descripcionMarc!: string;
}
