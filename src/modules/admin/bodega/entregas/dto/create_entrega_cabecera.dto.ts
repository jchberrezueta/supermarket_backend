import { EnumEstadoEntrega } from '@models';
import { Transform, Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class CreateEntregaCabeceraDTO {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  idePedi!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  ideProv!: number;

  @IsDateString()
  fechaEntr!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  cantidadTotalEntr!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totalEntr!: number;

  @IsEnum(EnumEstadoEntrega)
  estadoEntr!: EnumEstadoEntrega;

  @IsOptional()
  @IsString()
  @Length(1, 250)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== ''
      ? value.trim().toLowerCase()
      : 'ninguna',
  )
  observacionEntr?: string;
}
