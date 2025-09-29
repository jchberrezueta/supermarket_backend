import { Module } from '@nestjs/common';
import {EntregasModule} from './entregas/entregas.module';
import {PedidosModule} from './pedidos/pedidos.module';


@Module({
    imports: [
        EntregasModule, 
        PedidosModule
    ],
})
export class BodegaModule {}