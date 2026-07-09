import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClienteEntity, CuentaClienteEntity } from '@entities';
import { MobileClientesController } from './clientes.controller';
import { MobileClientesService } from './clientes.service';

@Module({
  imports: [TypeOrmModule.forFeature([ClienteEntity, CuentaClienteEntity])],
  controllers: [MobileClientesController],
  providers: [MobileClientesService],
  exports: [MobileClientesService],
})
export class MobileClientesModule {}
