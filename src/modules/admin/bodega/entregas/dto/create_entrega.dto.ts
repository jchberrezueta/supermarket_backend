import { 
  ValidateNested,
  IsArray
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateEntregaCabeceraDTO } from './create_entrega_cabecera.dto';
import { CreatePedidoDetalleDTO } from '../../pedidos/dto/create_pedido_detalle.dto';

export class CreateEntregaDTO {

  @ValidateNested()
  @Type( () => CreateEntregaCabeceraDTO)
  cabeceraEntrega: CreateEntregaCabeceraDTO;

  @IsArray()
  @ValidateNested({each: true})
  @Type( () => CreatePedidoDetalleDTO)
  detalleEntrega: CreatePedidoDetalleDTO[];

}