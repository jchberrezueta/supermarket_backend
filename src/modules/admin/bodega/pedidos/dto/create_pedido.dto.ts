import { 
  ValidateNested,
  IsArray
} from 'class-validator';
import { Type } from 'class-transformer';
import { PedidoCabeceraDTO } from './pedido_cabecera.dto';
import { PedidoDetalleDTO } from './pedido_detalle.dto';

export class CreatePedidoDTO {

  @ValidateNested()
  @Type( () => PedidoCabeceraDTO)
  cabeceraPedido: PedidoCabeceraDTO;

  @IsArray()
  @ValidateNested({each: true})
  @Type( () => PedidoDetalleDTO)
  detallePedido: PedidoDetalleDTO[];

}