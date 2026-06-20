import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetallePedidoEntity, EmpresaEntity, PedidoEntity } from '@entities';
import { PedidosController } from './pedidos.controller';
import { PedidosMapper } from './pedidos.mapper';
import { PedidosRepository } from './pedidos.repository';
import { PedidosService } from './pedidos.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PedidoEntity,
      DetallePedidoEntity,
      EmpresaEntity,
    ]),
  ],
  controllers: [PedidosController],
  providers: [PedidosService, PedidosRepository, PedidosMapper],
})
export class PedidosModule {}
