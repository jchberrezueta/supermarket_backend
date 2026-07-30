import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  DetallePedidoEntity,
  EmpresaEntity,
  EmpresaPreciosEntity,
  EntregaEntity,
  PedidoEntity,
  ProductoEntity,
  DetallePedidoLoteDevolucionEntity,
} from '@entities';
import { AuthorizationModule } from 'src/modules/auth/authorization';
import { PedidosController } from './pedidos.controller';
import { PedidosMapper } from './pedidos.mapper';
import { PedidosRepository } from './pedidos.repository';
import { PedidosService } from './pedidos.service';

@Module({
  imports: [
    AuthorizationModule,
    TypeOrmModule.forFeature([
      PedidoEntity,
      DetallePedidoEntity,
      EmpresaEntity,
      EmpresaPreciosEntity,
      ProductoEntity,
      EntregaEntity,
      DetallePedidoLoteDevolucionEntity,
    ]),
  ],
  controllers: [PedidosController],
  providers: [PedidosService, PedidosRepository, PedidosMapper],
})
export class PedidosModule {}
