import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerfilEntity, PerfilOpcionesEntity, RolEntity } from '@entities';
import { AuthorizationModule } from 'src/modules/auth/authorization';
import { PerfilesController } from './perfiles.controller';
import { PerfilesMapper } from './perfiles.mapper';
import { PerfilesRepository } from './perfiles.repository';
import { PerfilesService } from './perfiles.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PerfilEntity, PerfilOpcionesEntity, RolEntity]),
    AuthorizationModule,
  ],
  controllers: [PerfilesController],
  providers: [PerfilesService, PerfilesRepository, PerfilesMapper],
  exports: [PerfilesRepository],
})
export class PerfilesModule {}
