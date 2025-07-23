import { Module } from '@nestjs/common';
import { CuentasModule } from './cuentas/cuentas.module';




@Module({
    imports: [CuentasModule],
})
export class SeguridadModule {}