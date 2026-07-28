import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CuentaEntity, EmpleadoEntity, PerfilEntity } from '@entities';
import { AuthorizationModule } from 'src/modules/auth/authorization';
import { CuentasController } from './cuentas.controller';
import { CuentasMapper } from './cuentas.mapper';
import { CuentasRepository } from './cuentas.repository';
import { CuentasService } from './cuentas.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CuentaEntity, EmpleadoEntity, PerfilEntity]),
    AuthorizationModule,
  ],
  controllers: [CuentasController],
  providers: [CuentasService, CuentasRepository, CuentasMapper],
  exports: [CuentasService],
})
export class CuentasModule {}
