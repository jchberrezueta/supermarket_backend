import { EnumEstadoVenta } from '@models';
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

export class UpdateVentaCabeceraDTO {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  ideVent!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  ideEmpl!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  ideClie!: number;

  @IsString()
  @Length(1, 25)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== ''
      ? value.trim().toLowerCase()
      : null,
  )
  numFacturaVent!: string;

  @IsDateString()
  fechaVent!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  cantidadVent!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  subTotalVent!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totalVent!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  dctoSocioVent!: number;

  @IsEnum(EnumEstadoVenta)
  estadoVent!: EnumEstadoVenta;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  dctoEdadVent!: number;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== ''
      ? value.trim().toLowerCase()
      : 'efectivo',
  )
  tipoPagoVent?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  ideMetoPago?: number | null;
}
