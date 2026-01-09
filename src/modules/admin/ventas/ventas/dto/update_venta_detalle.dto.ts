import { IsInt, Min, IsNumber, IsOptional } from 'class-validator';
import { IDetalleVenta } from '@models';

export class UpdateVentaDetalleDTO implements IDetalleVenta {
  @IsInt()
  @Min(-1)  // Puede ser -1 para nuevos o >= 0 para existentes
  ideDetaVent: number;

  @IsInt()
  @Min(-1)  // Puede ser -1 para nuevos o >= 0 para existentes
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
    // Orden: ide_deta_vent, ide_vent, ide_prod, cantidad_prod, precio_unitario_prod, subtotal_prod, iva_prod, dcto_promo_prod, total_prod
    return [
      this.ideDetaVent,
      this.ideVent,
      this.ideProd,
      this.cantidadProd,
      this.precioUnitarioProd,
      this.subtotalProd,
      this.ivaProd,
      this.dctoPromoProd,
      this.totalProd,
    ]
  }
}