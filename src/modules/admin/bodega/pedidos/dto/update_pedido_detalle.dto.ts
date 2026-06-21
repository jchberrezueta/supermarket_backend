import { EnumEstadoDetallePedido } from '@models';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNumber, Min } from 'class-validator';

export class UpdatePedidoDetalleDTO {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  ideDetaPedi!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  idePedi!: number;

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
