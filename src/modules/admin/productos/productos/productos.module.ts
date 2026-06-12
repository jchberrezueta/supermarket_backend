import { DatabaseModule } from '@database';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoEntity } from '@entities';
import { ProductosController } from './productos.controller';
import { ProductosRepository } from './productos.repository';
import { ProductosService } from './productos.service';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([ProductoEntity])],
  controllers: [ProductosController],
  providers: [ProductosService, ProductosRepository],
  exports: [ProductosRepository],
})
export class ProductitosModule {}
