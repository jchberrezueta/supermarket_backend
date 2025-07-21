import { Module } from '@nestjs/common';
import {PedidosController} from './pedidos.controller';
import { PedidosService } from './pedidos.service';

@Module({
    imports: [],
    controllers: [PedidosController],
    providers: [PedidosService]
})
export class PedidosModule {}