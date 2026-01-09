import { EnumEstadoDetallePedido } from '@models';
import { Transform } from 'class-transformer';
import { 
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  Min
} from 'class-validator';

export class CreatePedidoDetalleDTO {

  @IsOptional()
  ideDetaPedi?: number;

  @IsOptional()
  idePedi?: number;

  @IsInt()
  @Min(0)
  @Transform(({ value }) => parseInt(value))
  ideProd: number;

  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  cantidadProd: number;

  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  precioUnitarioProd: number;

  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  subtotalProd: number;

  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  dctoCompraProd: number;

  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  ivaProd: number;

  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  totalProd: number;

  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  dctoCaducProd: number;

  @IsEnum(EnumEstadoDetallePedido)
  estadoDetaPedi: EnumEstadoDetallePedido

  toArray(): any[] {
    return [
      this.ideProd,
      this.cantidadProd,
      this.precioUnitarioProd,
      this.subtotalProd,
      this.ivaProd,
      this.dctoCompraProd,
      this.dctoCaducProd,
      this.totalProd,
      this.estadoDetaPedi
    ]
  }
}