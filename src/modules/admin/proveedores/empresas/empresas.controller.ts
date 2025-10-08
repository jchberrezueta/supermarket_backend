import { Controller, Get, Post, Patch, Delete, Body, UseGuards, Put, Param } from '@nestjs/common';
import { EmpresasService } from './empresas.service';
import { Roles } from 'src/modules/auth/roles.decorator';
import { RolesGuard } from 'src/modules/auth/roles.guard';
import { CreateEmpresaDTO } from './dto/create_empresa.dto';

@UseGuards(RolesGuard)
@Roles('bodega')
@Controller('empresas')
export class EmpresasController {

    constructor(private servicio: EmpresasService) {}

    @Get()
    async listarEmpresas() {
        console.log('lo logramos :)');
        return this.servicio.listarEmpresas(); 
    }

    @Get('buscar/:id')
    async buscarEmpresa(@Param('id') id:number) {
        return this.servicio.buscarEmpresa(id); 
    }

    @Get()
    async filtrarEmpresas() {
        return this.servicio.filtrarEmpresa(); 
    }

    @Post()
    async insertarEmpresa(@Body() empresa: CreateEmpresaDTO) {
        return this.servicio.insertarEmpresa(empresa); 
    }

    @Put()
    async actualizarEmpresa() {
        return this.servicio.actualizarEmpresa(); 
    }

    @Delete()
    async eliminarEmpresa() {
        return this.servicio.eliminarEmpresa(); 
    }
}