import { Controller, Get, Post, Delete, Body, Put, Param, Query, UseGuards } from '@nestjs/common';
import { AccesosUsuariosService } from './accesos.service';
import { FiltroAccesoDto } from './dto/filter_acceso.dto';
import { Roles } from 'src/modules/auth/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/modules/auth/roles.guard';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('padmin', 'pseguridad')
@Controller('accesos')
export class accesosController {
    constructor(private servicio: AccesosUsuariosService) {}

    @Get()
    async listar() {
        return this.servicio.listar(); 
    }


    @Get('filtrar')
    async filtrar(@Query() queryParams: FiltroAccesoDto) {
        return this.servicio.filtrar(queryParams); 
    }
}