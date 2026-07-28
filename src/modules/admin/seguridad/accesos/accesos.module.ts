import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccesoUsuarioEntity, CuentaEntity } from '@entities';
import { AuthorizationModule } from 'src/modules/auth/authorization';
import { accesosController } from './accesos.controller';
import { AccesosMapper } from './accesos.mapper';
import { AccesosRepository } from './accesos.repository';
import { AccesosUsuariosService } from './accesos.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccesoUsuarioEntity, CuentaEntity]),
    AuthorizationModule,
  ],
  controllers: [accesosController],
  providers: [AccesosUsuariosService, AccesosRepository, AccesosMapper],
  exports: [AccesosUsuariosService],
})
export class accesosModule {}
