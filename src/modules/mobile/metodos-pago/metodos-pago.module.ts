import { Module } from '@nestjs/common';
import { MetodosPagoController } from './metodos-pago.controller';
import { MetodosPagoService } from './metodos-pago.service';
import { DatabaseModule } from '@database';

@Module({
    imports: [DatabaseModule],
    controllers: [MetodosPagoController],
    providers: [MetodosPagoService],
    exports: [MetodosPagoService]
})
export class MetodosPagoModule {}
