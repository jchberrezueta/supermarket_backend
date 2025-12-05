import { Module } from '@nestjs/common';
import { EmpleadosModule } from './empleados/empleados.module';
import { RolesModule } from './roles/roles.module';


@Module({
    imports: [
        EmpleadosModule,
        RolesModule
    ]
})
export class NominaModule {}