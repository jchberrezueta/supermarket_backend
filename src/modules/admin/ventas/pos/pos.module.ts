import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ClienteEntity,
  DetalleVentaEntity,
  ProductoEntity,
  VentaEntity,
} from '@entities';
import { PosController } from './pos.controller';
import { PosRepository } from './pos.repository';
import { PosService } from './pos.service';
import { PosScanController } from './pos-scan.controller';
import { PosScanGateway } from './pos-scan.gateway';
import { PosScanService } from './pos-scan.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClienteEntity,
      ProductoEntity,
      VentaEntity,
      DetalleVentaEntity,
    ]),
  ],
  controllers: [PosController, PosScanController],
  providers: [PosService, PosRepository, PosScanService, PosScanGateway],
})
export class PosModule {}
