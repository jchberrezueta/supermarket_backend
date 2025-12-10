import { CreateEntregaDetalleDTO } from './create_entrega_detalle.dto';
import { IsInt, Min } from 'class-validator';

export class UpdateEntregaDetalleDTO extends (CreateEntregaDetalleDTO) {
  @IsInt()
  @Min(0)
  ideDetaEntr: number;

  @IsInt()
  @Min(0)
  ideEntr: number;

  toArray(): any[] {
    const lista = super.toArray();
    lista.unshift(this.ideEntr);
    lista.unshift(this.ideDetaEntr);
    return lista;
  }
}