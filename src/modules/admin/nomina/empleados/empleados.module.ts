import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpleadoEntity, RolEntity } from '@entities';
import { EmpleadosController } from './empleados.controller';
import { EmpleadosMapper } from './empleados.mapper';
import { EmpleadosRepository } from './empleados.repository';
import { EmpleadosService } from './empleados.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmpleadoEntity, RolEntity])],
  controllers: [EmpleadosController],
  providers: [EmpleadosService, EmpleadosRepository, EmpleadosMapper],
})
export class EmpleadosModule {}
