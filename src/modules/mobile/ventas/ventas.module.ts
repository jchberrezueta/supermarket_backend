import { Module } from '@nestjs/common';
import { MobileVentasController } from './ventas.controller';
import { MobileVentasService } from './ventas.service';
import { DatabaseModule } from '@database';

@Module({
    imports: [DatabaseModule],
    controllers: [MobileVentasController],
    providers: [MobileVentasService],
    exports: [MobileVentasService]
})
export class MobileVentasModule {}
