import {
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ItemVentaPosDto } from './item_venta_pos.dto';

export class ConfirmarVentaPosDto {
  @IsInt()
  @Min(0)
  ideClie!: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  ideEmpl?: number;

  @IsOptional()
  @IsIn(['efectivo', 'tarjeta_credito', 'tarjeta_debito', 'paypal'])
  tipoPagoVent?: 'efectivo' | 'tarjeta_credito' | 'tarjeta_debito' | 'paypal';

  @IsOptional()
  @IsInt()
  @Min(0)
  ideMetoPago?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemVentaPosDto)
  items!: ItemVentaPosDto[];
}
