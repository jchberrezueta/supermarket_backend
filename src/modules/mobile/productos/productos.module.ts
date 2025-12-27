import { Module } from '@nestjs/common';
import { MobileProductosController } from './productos.controller';
import { MobileProductosService } from './productos.service';
import { DatabaseModule } from '@database';

@Module({
    imports: [DatabaseModule],
    controllers: [MobileProductosController],
    providers: [MobileProductosService],
    exports: [MobileProductosService]
})
export class MobileProductosModule {}
