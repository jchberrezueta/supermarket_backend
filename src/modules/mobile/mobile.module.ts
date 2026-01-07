import { Module } from '@nestjs/common';
import { ClienteAuthModule } from './auth/auth.module';
import { MobileProductosModule } from './productos/productos.module';
import { MobileCategoriasModule } from './categorias/categorias.module';
import { MobileVentasModule } from './ventas/ventas.module';
import { MobileClientesModule } from './clientes/clientes.module';
import { MetodosPagoModule } from './metodos-pago/metodos-pago.module';

@Module({
    imports: [
        ClienteAuthModule,
        MobileProductosModule,
        MobileCategoriasModule,
        MobileVentasModule,
        MobileClientesModule,
        MetodosPagoModule
    ],
})
export class MobileModule {}
