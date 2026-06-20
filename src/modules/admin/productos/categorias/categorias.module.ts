import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaEntity } from '@entities';
import { CategoriasController } from './categorias.controller';
import { CategoriasMapper } from './categorias.mapper';
import { CategoriasRepository } from './categorias.repository';
import { CategoriasService } from './categorias.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoriaEntity])],
  controllers: [CategoriasController],
  providers: [CategoriasService, CategoriasRepository, CategoriasMapper],
})
export class CategoriasModule {}
