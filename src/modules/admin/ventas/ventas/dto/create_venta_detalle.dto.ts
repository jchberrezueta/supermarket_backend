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
  dctoProd: number;

  @IsNumber()
  @Min(0)
  dctoPromo: number;

  @IsNumber()
  @Min(0)
  ivaProd: number;

  toArray(): any[] {
    return [
      this.ideProd,
      this.cantidadProd,
      this.precioUnitarioProd,
      this.dctoProd,
      this.dctoPromo,
      this.ivaProd,
      this.subtotalProd
    ]
  }
}