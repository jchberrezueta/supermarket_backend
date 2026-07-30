import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarcaEntity } from '@entities';
import { AuthorizationModule } from 'src/modules/auth/authorization';
import { MarcasController } from './marcas.controller';
import { MarcasMapper } from './marcas.mapper';
import { MarcasRepository } from './marcas.repository';
import { MarcasService } from './marcas.service';

@Module({
  imports: [AuthorizationModule, TypeOrmModule.forFeature([MarcaEntity])],
  controllers: [MarcasController],
  providers: [MarcasService, MarcasRepository, MarcasMapper],
})
export class MarcasModule {}
