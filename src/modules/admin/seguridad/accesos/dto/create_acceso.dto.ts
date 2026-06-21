import { Transform, Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class CreateAccesoUsuarioDto {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  ideCuen!: number;

  @IsString()
  @Length(1, 250)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : null,
  )
  navegadorAcce!: string;

  @IsOptional()
  @IsDateString()
  fechaAcce?: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  numIntFallAcce!: number;

  @IsString()
  @Length(1, 15)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : null,
  )
  ipAcce!: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitudAcce?: number | null;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitudAcce?: number | null;
}
