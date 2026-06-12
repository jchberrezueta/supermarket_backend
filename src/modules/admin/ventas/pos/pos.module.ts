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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClienteEntity,
      ProductoEntity,
      VentaEntity,
      DetalleVentaEntity,
    ]),
  ],
  controllers: [PosController],
  providers: [PosService, PosRepository],
})
export class PosModule {}
