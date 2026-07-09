import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { CreatePedidoDetalleDTO } from './create_pedido_detalle.dto';
import { UpdatePedidoCabeceraDTO } from './update_pedido_cabecera.dto';

export class UpdatePedidoDTO {
  @ValidateNested()
  @Type(() => UpdatePedidoCabeceraDTO)
  cabeceraPedido!: UpdatePedidoCabeceraDTO;

  /**
   * En actualización se reemplazan los detalles completos del pedido.
   * Por eso se usa CreatePedidoDetalleDTO: los detalles nuevos no necesitan
   * ideDetaPedi obligatorio.
   */
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreatePedidoDetalleDTO)
  detallePedido!: CreatePedidoDetalleDTO[];
}
