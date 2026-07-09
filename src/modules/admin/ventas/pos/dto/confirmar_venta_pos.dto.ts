import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
import { ItemVentaPosDto } from './item_venta_pos.dto';

function toRequiredInt(value: unknown): number | unknown {
  if (value === null || value === undefined || value === '') {
    return value;
  }

  const numberValue = Number(value);

  if (Number.isInteger(numberValue)) {
    return numberValue;
  }

  return value;
}

function optionalIntOrNull(value: unknown): number | null | unknown {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const numberValue = Number(value);

  if (Number.isInteger(numberValue)) {
    return numberValue;
  }

  return value;
}

export class ConfirmarVentaPosDto {
  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(0)
  ideClie!: number;

  @IsOptional()
  @Transform(({ value }) => optionalIntOrNull(value))
  @IsInt()
  @Min(0)
  ideEmpl?: number | null;

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined,
  )
  @IsIn(['efectivo', 'tarjeta_credito', 'tarjeta_debito', 'paypal'])
  tipoPagoVent?: 'efectivo' | 'tarjeta_credito' | 'tarjeta_debito' | 'paypal';

  @IsOptional()
  @Transform(({ value }) => optionalIntOrNull(value))
  @IsInt()
  @Min(0)
  ideMetoPago?: number | null;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ItemVentaPosDto)
  items!: ItemVentaPosDto[];
}
