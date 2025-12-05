import { Module } from '@nestjs/common';
import {EmpresasController} from './empresas.controller';
import { EmpresasService } from './empresas.service';
import { DatabaseModule } from '@database';

@Module({
    imports: [DatabaseModule],
    controllers: [EmpresasController],
    providers: [EmpresasService]
})
export class EmpresasModule {}