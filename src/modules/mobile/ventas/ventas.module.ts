import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ClienteEntity,
  DetalleVentaEntity,
  ProductoEntity,
  VentaEntity,
} from '@entities';
import { MobileVentasController } from './ventas.controller';
import { MobileVentasService } from './ventas.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClienteEntity,
      ProductoEntity,
      VentaEntity,
      DetalleVentaEntity,
    ]),
  ],
  controllers: [MobileVentasController],
  providers: [MobileVentasService],
  exports: [MobileVentasService],
})
export class MobileVentasModule {}
