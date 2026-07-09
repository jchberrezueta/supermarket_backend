import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { CreatePedidoCabeceraDTO } from './create_pedido_cabecera.dto';
import { CreatePedidoDetalleDTO } from './create_pedido_detalle.dto';

export class CreatePedidoDTO {
  @ValidateNested()
  @Type(() => CreatePedidoCabeceraDTO)
  cabeceraPedido!: CreatePedidoCabeceraDTO;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreatePedidoDetalleDTO)
  detallePedido!: CreatePedidoDetalleDTO[];
}
