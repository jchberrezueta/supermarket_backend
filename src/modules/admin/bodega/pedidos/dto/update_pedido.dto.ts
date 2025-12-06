import { PartialType } from '@nestjs/mapped-types';
import { CreatePedidoDTO } from './create_pedido.dto';

export class UpdatePedidoDTO extends PartialType(CreatePedidoDTO) {}