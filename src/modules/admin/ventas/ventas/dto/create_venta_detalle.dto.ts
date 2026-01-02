import { IDetalleVenta } from '@models';
import { 
  Equals,
    IsInt,
    IsNumber,
    Min
} from 'class-validator';

export class CreateVentaDetalleDTO implements IDetalleVenta {

  @IsInt()
  @Equals(-1)
  ideDetaVent: number;

  @IsInt()
  @Equals(-1)
  ideVent: number;

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
  dctoPromoProd: number;

  @IsNumber()
  @Min(0)
  ivaProd: number;

  @IsNumber()
  @Min(0)
  totalProd: number;

  toArray(): any[] {
    return [
      this.ideProd,
      this.cantidadProd,
      this.precioUnitarioProd,
      this.dctoPromoProd,
      this.ivaProd,
      this.subtotalProd,
      this.totalProd,
    ]
  }
}