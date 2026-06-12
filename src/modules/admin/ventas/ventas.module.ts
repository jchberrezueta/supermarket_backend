import { Module } from '@nestjs/common';
import { ClientesModule } from './clientes/clientes.module';
import { PosModule } from './pos/pos.module';
import { VentitasModule } from './ventas/ventas.module';

@Module({
  imports: [ClientesModule, VentitasModule, PosModule],
})
export class VentasModule {}
