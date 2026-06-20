import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerfilEntity, PerfilOpcionesEntity, RolEntity } from '@entities';
import { PerfilesController } from './perfiles.controller';
import { PerfilesMapper } from './perfiles.mapper';
import { PerfilesRepository } from './perfiles.repository';
import { PerfilesService } from './perfiles.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PerfilEntity, PerfilOpcionesEntity, RolEntity]),
  ],
  controllers: [PerfilesController],
  providers: [PerfilesService, PerfilesRepository, PerfilesMapper],
  exports: [PerfilesRepository],
})
export class PerfilesModule {}
