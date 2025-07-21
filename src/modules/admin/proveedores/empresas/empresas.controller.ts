import { Controller, Get, Post, Patch, Delete, Body } from '@nestjs/common';
import { EmpresasService } from './empresas.service';


@Controller('empresas')
export class EmpresasController {

    constructor(private servicio: EmpresasService) {}


    @Get()
    async testProducto() {
        return await this.servicio.getEmpresas(); 
    }
}