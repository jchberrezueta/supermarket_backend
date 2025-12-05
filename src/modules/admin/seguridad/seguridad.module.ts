import { Module } from '@nestjs/common';
import { CuentasModule } from './cuentas/cuentas.module';
import { accesosModule } from './accesos/accesos.module';
import { OpcionesModule } from './opciones/opciones.module';
import { PerfilesModule } from './perfiles/perfiles.module';

@Module({
    imports: [
        accesosModule,
        CuentasModule,
        OpcionesModule,
        PerfilesModule
    ],
})
export class SeguridadModule {}