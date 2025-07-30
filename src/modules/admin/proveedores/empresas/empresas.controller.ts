import { Controller, Get, Post, Patch, Delete, Body, UseGuards } from '@nestjs/common';
import { EmpresasService } from './empresas.service';
import { Roles } from 'src/modules/auth/roles.decorator';
import { RolesGuard } from 'src/modules/auth/roles.guard';

@UseGuards(RolesGuard)
@Roles('gerente')
@Controller('empresas')
export class EmpresasController {

    constructor(private servicio: EmpresasService) {}


    @Get()
    async testProducto() {
        //console.log('lo logramos');
        return await this.servicio.getEmpresas(); 
    }
}