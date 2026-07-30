import { Module } from '@nestjs/common';
import { MovimientosInventarioController } from './movimientos.controller';
import { MovimientosInventarioRepository } from './movimientos.repository';
import { MovimientosInventarioService } from './movimientos.service';

@Module({
  controllers: [MovimientosInventarioController],
  providers: [MovimientosInventarioService, MovimientosInventarioRepository],
})
export class MovimientosInventarioModule {}
