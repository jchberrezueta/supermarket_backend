import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleVentaEntity, VentaEntity } from '@entities';
import { VentasController } from './ventas.controller';
import { VentasMapper } from './ventas.mapper';
import { VentasRepository } from './ventas.repository';
import { VentasService } from './ventas.service';

@Module({
  imports: [TypeOrmModule.forFeature([VentaEntity, DetalleVentaEntity])],
  controllers: [VentasController],
  providers: [VentasService, VentasRepository, VentasMapper],
})
export class VentitasModule {}
