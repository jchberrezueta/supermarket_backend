import { Module } from '@nestjs/common';
import { DatabaseModule } from '@database';
import {EntregasController} from './entregas.controller';
import { EntregasService } from './entregas.service';

@Module({
    imports: [DatabaseModule],
    controllers: [EntregasController],
    providers: [EntregasService]
})
export class EntregasModule {}