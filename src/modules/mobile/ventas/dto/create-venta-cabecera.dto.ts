import {
  IsDateString,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateVentaCabeceraDto {
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(0)
  ideClie!: number;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined,
  )
  numFacturaVent?: string;

  @IsOptional()
  @IsDateString()
  fechaVent?: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1)
  cantidadVent!: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  subTotalVent!: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  totalVent!: number;

  @Transform(({ value }) => Number(value ?? 0))
  @IsNumber()
  @Min(0)
  @IsOptional()
  dctoSocioVent = 0;

  @Transform(({ value }) => Number(value ?? 0))
  @IsNumber()
  @Min(0)
  @IsOptional()
  dctoEdadVent = 0;

  @IsString()
  @IsOptional()
  usuaIngre?: string;

  @IsOptional()
  @IsIn(['efectivo', 'tarjeta_credito', 'tarjeta_debito', 'paypal'])
  tipoPagoVent?: 'efectivo' | 'tarjeta_credito' | 'tarjeta_debito' | 'paypal';

  @Transform(({ value }) =>
    value === null || value === undefined || value === ''
      ? undefined
      : Number(value),
  )
  @IsInt()
  @Min(0)
  @IsOptional()
  ideMetoPago?: number;
}
