import { DatabaseModule } from '@database';
import { Module } from '@nestjs/common';
import { OpcionesController } from './opciones.controller';
import { OpcionesService } from './opciones.service';

@Module({
    imports: [DatabaseModule],
    controllers: [OpcionesController],
    providers: [OpcionesService]
})
export class OpcionesModule {}