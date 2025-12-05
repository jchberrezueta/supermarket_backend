import { Module } from '@nestjs/common';
import {
    BodegaModule,
    NominaModule,
    ProductosModule,
    ProveedoresModule, 
    SeguridadModule,
    VentasModule
} from '@admin';

@Module({
    imports: [
        BodegaModule,
        NominaModule,
        ProductosModule,
        ProveedoresModule,
        SeguridadModule,
        VentasModule
    ],
})
export class AdminModule {}
