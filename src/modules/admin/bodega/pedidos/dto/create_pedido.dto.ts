import { 
  ValidateNested,
  IsArray
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePedidoCabeceraDTO } from './create_pedido_cabecera.dto';
import { CreatePedidoDetalleDTO } from './create_pedido_detalle.dto';

export class CreatePedidoDTO {

  @ValidateNested()
  @Type( () => CreatePedidoCabeceraDTO)
  cabeceraPedido: CreatePedidoCabeceraDTO;

  @IsArray()
  @ValidateNested({each: true})
  @Type( () => CreatePedidoDetalleDTO)
  detallePedido: CreatePedidoDetalleDTO[];

}