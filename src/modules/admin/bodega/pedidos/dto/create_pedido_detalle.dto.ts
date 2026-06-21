import { EnumEstadoDetallePedido } from '@models';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class CreatePedidoDetalleDTO {
  /**
   * Opcional porque en creación la BD genera el ID.
   * Se mantiene para compatibilidad si el frontend lo envía.
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  ideDetaPedi?: number;

  /**
   * Opcional porque la cabecera recién creada define el pedido.
   * Se mantiene para compatibilidad si el frontend lo envía.
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  idePedi?: number;

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
  dctoCompraProd!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  ivaProd!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totalProd!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  dctoCaducProd!: number;

  @IsEnum(EnumEstadoDetallePedido)
  estadoDetaPedi!: EnumEstadoDetallePedido;
}
