import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolEntity } from '@entities';
import { RolesController } from './roles.controller';
import { RolesMapper } from './roles.mapper';
import { RolesRepository } from './roles.repository';
import { RolesService } from './roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([RolEntity])],
  controllers: [RolesController],
  providers: [RolesService, RolesRepository, RolesMapper],
})
export class RolesModule {}
