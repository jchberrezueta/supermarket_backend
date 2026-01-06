import { Module } from '@nestjs/common';
import { EmpresasModule } from './empresas/empresas.module';
import { ProveedoritosModule } from './proveedores/proveedores.module';

@Module({
    imports: [
        EmpresasModule, 
        ProveedoritosModule
    ],
})
export class ProveedoresModule {}