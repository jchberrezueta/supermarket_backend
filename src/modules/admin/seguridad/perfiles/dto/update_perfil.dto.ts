import { Transform, Type } from 'class-transformer';
import { IsInt, IsString, Length, Min } from 'class-validator';

export class UpdatePerfilDto {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  idePerf!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  ideRol!: number;

  @IsString()
  @Length(1, 100)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== ''
      ? value.trim().toLowerCase()
      : null,
  )
  nombrePerf!: string;

  @IsString()
  @Length(1, 250)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== ''
      ? value.trim().toLowerCase()
      : 'ninguna',
  )
  descripcionPerf!: string;
}
