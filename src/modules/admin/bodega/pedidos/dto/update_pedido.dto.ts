import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdatePedidoCabeceraDTO } from './update_pedido_cabecera.dto';
import { UpdatePedidoDetalleDTO } from './update_pedido_detalle.dto';

export class UpdatePedidoDTO {

  @ValidateNested()
  @Type( () => UpdatePedidoCabeceraDTO)
  cabeceraPedido: UpdatePedidoCabeceraDTO;

  @IsArray()
  @ValidateNested({each: true})
  @Type( () => UpdatePedidoDetalleDTO)
  detallePedido: UpdatePedidoDetalleDTO[];

}