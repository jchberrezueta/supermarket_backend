import { Module } from '@nestjs/common';
import { ClientesModule } from './clientes/clientes.module';
import { VentitasModule } from './ventas/ventas.module';

@Module({
    imports: [
        ClientesModule,
        VentitasModule
    ]
})
export class VentasModule {}