import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccesoUsuarioEntity, CuentaEntity } from '@entities';
import { accesosController } from './accesos.controller';
import { AccesosMapper } from './accesos.mapper';
import { AccesosRepository } from './accesos.repository';
import { AccesosUsuariosService } from './accesos.service';

@Module({
  imports: [TypeOrmModule.forFeature([AccesoUsuarioEntity, CuentaEntity])],
  controllers: [accesosController],
  providers: [AccesosUsuariosService, AccesosRepository, AccesosMapper],
  exports: [AccesosUsuariosService],
})
export class accesosModule {}
