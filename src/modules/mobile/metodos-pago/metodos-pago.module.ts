import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetodoPagoClienteEntity } from '@entities';
import { MetodosPagoController } from './metodos-pago.controller';
import { MetodosPagoService } from './metodos-pago.service';

@Module({
  imports: [TypeOrmModule.forFeature([MetodoPagoClienteEntity])],
  controllers: [MetodosPagoController],
  providers: [MetodosPagoService],
  exports: [MetodosPagoService],
})
export class MetodosPagoModule {}
