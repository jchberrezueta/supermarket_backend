import { DatabaseModule } from '@database';
import { Module } from '@nestjs/common';
import { EmpleadosController } from './empleados.controller';
import { EmpleadosService } from './empleados.service';

@Module({
    imports: [DatabaseModule],
    controllers: [EmpleadosController],
    providers: [EmpleadosService]
})
export class EmpleadosModule {}