import { Module } from '@nestjs/common';
import { EmpresasModule } from './empresas/empresas.module';

@Module({
    imports: [
        EmpresasModule, 
        ProveedoresModule
    ],
})
export class ProveedoresModule {}