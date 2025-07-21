import { Module } from '@nestjs/common';
import {
    BodegaModule,
    ProveedoresModule 
} from '@admin';



@Module({
    imports: [
        BodegaModule,
        ProveedoresModule
    ],
})
export class AdminModule {}
