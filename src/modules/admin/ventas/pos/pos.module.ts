import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ClienteEntity,
  DetalleVentaEntity,
  LoteEntity,
  MovimientoInventarioEntity,
  ProductoEntity,
  VentaEntity,
} from '@entities';
import { AuthorizationModule } from 'src/modules/auth/authorization';
import { PosController } from './pos.controller';
import { PosRepository } from './pos.repository';
import { PosService } from './pos.service';
import { PosScanController } from './pos-scan.controller';
import { PosScanGateway } from './pos-scan.gateway';
import { PosScanService } from './pos-scan.service';
import { InvoiceNumberService } from './domain/invoice-number.service';
import { PosCalculatorService } from './domain/pos-calculator.service';
import { StockPolicyService } from './domain/stock-policy.service';

@Module({
  imports: [
    AuthorizationModule,
    TypeOrmModule.forFeature([
      ClienteEntity,
      ProductoEntity,
      VentaEntity,
      DetalleVentaEntity,
      LoteEntity,
      MovimientoInventarioEntity,
    ]),
  ],
  controllers: [PosController, PosScanController],
  providers: [
    PosService,
    PosRepository,
    PosScanService,
    PosScanGateway,
    PosCalculatorService,
    InvoiceNumberService,
    StockPolicyService,
  ],
})
export class PosModule {}
