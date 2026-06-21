import { Transform, Type } from 'class-transformer';
import { IsNumber, IsString, Length, Max, Min } from 'class-validator';

export class CreateIotLecturaDto {
  @IsString()
  @Length(1, 50)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== ''
      ? value.trim().toUpperCase()
      : null,
  )
  codigoDispositivo!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(-40)
  @Max(80)
  temperatura!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  humedad!: number;
}
