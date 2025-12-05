import { Controller, Get, Post, Delete, Body, Put, Param, Query } from '@nestjs/common';
import { AccesosUsuariosService } from './accesos.service';
import { FiltroAccesoDto } from './dto/filter_acceso.dto';


@Controller('accesos')
export class accesosController {

    constructor(private servicio: AccesosUsuariosService) {}


    @Get('listar')
    async getAccesos() {
        return await this.servicio.listarAccesos(); 
    }


    @Get('filtrar')
    async filteraccesos(@Query() filtros: FiltroAccesoDto) {
        return await this.servicio.filtrarAccesos(filtros); 
    }

}