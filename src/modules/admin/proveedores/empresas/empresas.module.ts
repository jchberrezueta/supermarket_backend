import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpresaEntity, EmpresaPreciosEntity, ProductoEntity } from '@entities';
import { EmpresasController } from './empresas.controller';
import { EmpresasMapper } from './empresas.mapper';
import { EmpresasRepository } from './empresas.repository';
import { EmpresasService } from './empresas.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EmpresaEntity,
      EmpresaPreciosEntity,
      ProductoEntity,
    ]),
  ],
  controllers: [EmpresasController],
  providers: [EmpresasService, EmpresasRepository, EmpresasMapper],
  exports: [EmpresasRepository],
})
export class EmpresasModule {}
