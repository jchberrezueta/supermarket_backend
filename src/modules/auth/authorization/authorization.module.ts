import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CuentaEntity, OpcionesEntity, PerfilOpcionesEntity } from '@entities';
import { PermissionGuard } from './permission.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CuentaEntity,
      OpcionesEntity,
      PerfilOpcionesEntity,
    ]),
  ],
  providers: [PermissionGuard],
  exports: [PermissionGuard],
})
export class AuthorizationModule {}
