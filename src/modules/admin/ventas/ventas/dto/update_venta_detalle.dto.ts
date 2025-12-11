import { IsInt, Min } from 'class-validator';
import { CreateVentaDetalleDTO } from './create_venta_detalle.dto';

export class UpdateVentaDetalleDTO extends (CreateVentaDetalleDTO) {
  @IsInt()
  @Min(0)
  ideDetaVent: number;

  @IsInt()
  @Min(0)
  ideVent: number;

  toArray(): any[] {
    const lista = super.toArray();
    lista.unshift(this.ideVent);
    lista.unshift(this.ideDetaVent);
    return lista;
  }
}