import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpcionesEntity } from '@entities';
import { AuthorizationModule } from 'src/modules/auth/authorization';
import { OpcionesController } from './opciones.controller';
import { OpcionesMapper } from './opciones.mapper';
import { OpcionesRepository } from './opciones.repository';
import { OpcionesService } from './opciones.service';

@Module({
  imports: [TypeOrmModule.forFeature([OpcionesEntity]), AuthorizationModule],
  controllers: [OpcionesController],
  providers: [OpcionesService, OpcionesRepository, OpcionesMapper],
  exports: [OpcionesRepository],
})
export class OpcionesModule {}
