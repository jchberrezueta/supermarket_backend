import { TipoMovimientoInventario } from '@entities';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export const TIPOS_MOVIMIENTO_INVENTARIO: TipoMovimientoInventario[] = [
  'entrada_entrega',
  'salida_venta',
  'salida_devolucion_proveedor',
  'entrada_canje_caducidad',
  'anulacion_venta',
  'anulacion_entrega',
  'ajuste_entrada',
  'ajuste_salida',
  'correccion_lote',
];

export type TipoMovimientoFiltro = TipoMovimientoInventario;

function optionalInt(value: unknown): number | undefined | unknown {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }

  const numberValue = Number(value);

  return Number.isInteger(numberValue) ? numberValue : value;
}

function optionalString(value: unknown): string | undefined | unknown {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === 'string') {
    const text = value.trim();
    return text !== '' ? text : undefined;
  }

  return value;
}

export class FilterMovimientoInventarioDTO {
  @IsOptional()
  @Transform(({ value }) => optionalInt(value))
  @IsInt()
  @Min(1)
  ideProd?: number;

  @IsOptional()
  @Transform(({ value }) => optionalInt(value))
  @IsInt()
  @Min(1)
  ideLote?: number;

  @IsOptional()
  @Transform(({ value }) => optionalString(value))
  @IsIn(TIPOS_MOVIMIENTO_INVENTARIO)
  tipoMovi?: TipoMovimientoFiltro;

  @IsOptional()
  @Transform(({ value }) => optionalString(value))
  @IsDateString()
  fechaDesde?: string;

  @IsOptional()
  @Transform(({ value }) => optionalString(value))
  @IsDateString()
  fechaHasta?: string;

  @IsOptional()
  @Transform(({ value }) => optionalString(value))
  @IsString()
  @Length(1, 25)
  usuaIngre?: string;
}
