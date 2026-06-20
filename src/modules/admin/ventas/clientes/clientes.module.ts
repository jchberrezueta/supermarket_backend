import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClienteEntity, CuentaClienteEntity } from '@entities';
import { ClientesController } from './clientes.controller';
import { ClientesMapper } from './clientes.mapper';
import { ClientesRepository } from './clientes.repository';
import { ClientesService } from './clientes.service';

@Module({
  imports: [TypeOrmModule.forFeature([ClienteEntity, CuentaClienteEntity])],
  controllers: [ClientesController],
  providers: [ClientesService, ClientesRepository, ClientesMapper],
  exports: [ClientesRepository],
})
export class ClientesModule {}
