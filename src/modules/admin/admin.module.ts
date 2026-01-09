import { Module } from '@nestjs/common';
import {
    BodegaModule,
    NominaModule,
    ProductosModule,
    ProveedoresModule, 
    SeguridadModule,
    VentasModule
} from '@admin';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
    imports: [
        BodegaModule,
        NominaModule,
        ProductosModule,
        ProveedoresModule,
        SeguridadModule,
        VentasModule,
        DashboardModule
    ],
})
export class AdminModule {}
