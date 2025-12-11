import { DatabaseModule } from '@database';
import { Module } from '@nestjs/common';
import { VentasController } from './ventas.controller';
import { VentasService } from './ventas.service';

@Module({
    imports: [DatabaseModule],
    controllers: [VentasController],
    providers: [VentasService]
})
export class VentitasModule {}