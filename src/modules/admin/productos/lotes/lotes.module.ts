import { DatabaseModule } from '@database';
import { Module } from '@nestjs/common';
import { LotesController } from './lotes.controller';
import { LotesService } from './lotes.service';

@Module({
    imports: [DatabaseModule],
    controllers: [LotesController],
    providers: [LotesService],
})
export class LotesModule {}
