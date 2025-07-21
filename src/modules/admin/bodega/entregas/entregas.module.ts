import { Module } from '@nestjs/common';
import {EntregasController} from './entregas.controller';
import { EntregasService } from './entregas.service';

@Module({
    imports: [],
    controllers: [EntregasController],
    providers: [EntregasService]
})
export class EntregasModule {}