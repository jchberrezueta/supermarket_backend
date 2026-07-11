import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  DetalleEntregaEntity,
  DetalleEntregaLoteEntity,
  DetallePedidoEntity,
  EmpresaEntity,
  EntregaEntity,
  LoteEntity,
  MovimientoInventarioEntity,
  PedidoEntity,
  ProductoEntity,
  ProveedorEntity,
} from '@entities';
import { EntregasController } from './entregas.controller';
import { EntregasMapper } from './entregas.mapper';
import { EntregasRepository } from './entregas.repository';
import { EntregasService } from './entregas.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EntregaEntity,
      DetalleEntregaEntity,
      DetalleEntregaLoteEntity,
      DetallePedidoEntity,
      PedidoEntity,
      ProveedorEntity,
      EmpresaEntity,
      ProductoEntity,
      LoteEntity,
      MovimientoInventarioEntity,
    ]),
  ],
  controllers: [EntregasController],
  providers: [EntregasService, EntregasRepository, EntregasMapper],
})
export class EntregasModule {}
