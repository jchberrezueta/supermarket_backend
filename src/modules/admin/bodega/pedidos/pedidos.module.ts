import { Module } from '@nestjs/common';
import { DatabaseModule } from '@database';
import {PedidosController} from './pedidos.controller';
import { PedidosService } from './pedidos.service';

@Module({
    imports: [DatabaseModule],
    controllers: [PedidosController],
    providers: [PedidosService]
})
export class PedidosModule {}