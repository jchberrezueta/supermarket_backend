import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoteEntity, ProductoEntity } from '@entities';
import { LotesController } from './lotes.controller';
import { LotesMapper } from './lotes.mapper';
import { LotesRepository } from './lotes.repository';
import { LotesService } from './lotes.service';

@Module({
  imports: [TypeOrmModule.forFeature([LoteEntity, ProductoEntity])],
  controllers: [LotesController],
  providers: [LotesService, LotesRepository, LotesMapper],
})
export class LotesModule {}
