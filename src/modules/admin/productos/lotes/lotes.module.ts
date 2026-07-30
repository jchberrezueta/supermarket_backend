import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  DetalleEntregaLoteEntity,
  LoteEntity,
  MovimientoInventarioEntity,
  ProductoEntity,
} from '@entities';
import { AuthorizationModule } from 'src/modules/auth/authorization';
import { LotesController } from './lotes.controller';
import { LotesMapper } from './lotes.mapper';
import { LotesRepository } from './lotes.repository';
import { LotesService } from './lotes.service';

@Module({
  imports: [
    AuthorizationModule,
    TypeOrmModule.forFeature([
      LoteEntity,
      ProductoEntity,
      DetalleEntregaLoteEntity,
      MovimientoInventarioEntity,
    ]),
  ],
  controllers: [LotesController],
  providers: [LotesService, LotesRepository, LotesMapper],
})
export class LotesModule {}
