import { Module } from '@nestjs/common';
import {
    BodegaModule,
    ProveedoresModule, 
    SeguridadModule
} from '@admin';



@Module({
    imports: [
        BodegaModule,
        ProveedoresModule,
        SeguridadModule,
    ],
})
export class AdminModule {}
