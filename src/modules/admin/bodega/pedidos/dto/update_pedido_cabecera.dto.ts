import { PartialType } from '@nestjs/mapped-types';
import { CreatePedidoCabeceraDTO } from './create_pedido_cabecera.dto';

export class UpdatePedidoCabeceraDTO extends PartialType(CreatePedidoCabeceraDTO) {}