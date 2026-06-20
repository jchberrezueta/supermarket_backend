import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpresaEntity, ProveedorEntity } from '@entities';
import { ProveedoresController } from './proveedores.controller';
import { ProveedoresMapper } from './proveedores.mapper';
import { ProveedoresRepository } from './proveedores.repository';
import { ProveedoresService } from './proveedores.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProveedorEntity, EmpresaEntity])],
  controllers: [ProveedoresController],
  providers: [ProveedoresService, ProveedoresRepository, ProveedoresMapper],
  exports: [ProveedoresRepository],
})
export class ProveedoritosModule {}
