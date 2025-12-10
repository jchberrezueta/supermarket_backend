import { IDetallePedido } from '@models';
import { 
  Equals,
  IsInt,
    IsNumber,
    Min
} from 'class-validator';

export class CreatePedidoDetalleDTO implements IDetallePedido{

  @IsInt()
  @Equals(-1)
  ideDetaPedi: number;

  @IsInt()
  @Equals(-1)
  idePedi: number;

  @IsInt()
  @Min(0)
  ideProd: number;

  @IsInt()
  @Min(1)
  cantidadProd: number;

  @IsNumber()
  @Min(0)
  precioUnitarioProd: number;

  @IsNumber()
  @Min(0)
  subtotalProd: number;

  @IsNumber()
  @Min(0)
  dctoCompraProd: number;

  @IsNumber()
  @Min(0)
  ivaProd: number;

  @IsNumber()
  @Min(0)
  totalProd: number;

  @IsNumber()
  @Min(0)
  dctoCaducProd: number;

  toArray(): any[] {
    return [
      this.ideProd,
      this.cantidadProd,
      this.precioUnitarioProd,
      this.subtotalProd,
      this.dctoCompraProd,
      this.ivaProd,
      this.totalProd,
      this.dctoCaducProd
    ]
  }
}