import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateVentaDetalleDTO {
  /**
   * Opcional porque en creación la BD genera el ID.
   * Se mantiene para compatibilidad si el frontend lo envía.
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  ideDetaVent?: number;

  /**
   * Opcional porque la cabecera recién creada define la venta.
   * Se mantiene para compatibilidad si el frontend lo envía.
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  ideVent?: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  ideProd!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  cantidadProd!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  precioUnitarioProd!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  subtotalProd!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  dctoPromoProd!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  ivaProd!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totalProd!: number;
}
