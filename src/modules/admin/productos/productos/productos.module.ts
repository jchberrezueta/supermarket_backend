import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaEntity, MarcaEntity, ProductoEntity } from '@entities';
import { ProductosController } from './productos.controller';
import { ProductosMapper } from './productos.mapper';
import { ProductosRepository } from './productos.repository';
import { ProductosService } from './productos.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductoEntity, CategoriaEntity, MarcaEntity]),
  ],
  controllers: [ProductosController],
  providers: [ProductosService, ProductosRepository, ProductosMapper],
  exports: [ProductosRepository],
})
export class ProductitosModule {}
