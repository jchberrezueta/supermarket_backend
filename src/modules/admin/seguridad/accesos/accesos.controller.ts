import { Controller, Get, Post, Delete, Body, Put, Param, Query, UseGuards } from '@nestjs/common';
import { AccesosUsuariosService } from './accesos.service';
import { FilterAccesoUsuarioDto } from './dto/filter_acceso.dto';
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

    @Get('buscar/:id')
    async buscar(@Param('id') id: number) {
        return this.servicio.buscar(id); 
    }

    @Get('filtrar')
    async filtrar(@Query() queryParams: FilterAccesoUsuarioDto) {
        return this.servicio.filtrar(queryParams); 
    }


    /**
     * JOINS
     */
    @Get('listar/accesos')
    async listarAccesosUsuarios() {
        return this.servicio.listarAccesos(); 
    }
    @Get('filtrar/accesos')
    async filtrarAccesosUsuarios(@Query() queryParams: FilterAccesoUsuarioDto) {
        return this.servicio.filtrarAccesos(queryParams); 
    }

    /**
     * COMBOS
     */
    @Get('listar/combo/ips')
    async listarComboIps() {
        return this.servicio.listarComboIps(); 
    }
    @Get('listar/combo/navegador')
    async listarComboNavegador() {
        return this.servicio.listarComboNavegador(); 
    }
}