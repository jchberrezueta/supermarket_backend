import { Controller, Get, Post, Delete, Body, UseGuards, Put, Param, Query } from '@nestjs/common';
import {ProveedoresService } from './proveedores.service';
import { Roles } from 'src/modules/auth/roles.decorator';
import { RolesGuard } from 'src/modules/auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { CreateProveedorDTO } from './dto/create_proveedor.dto';
import { UpdateProveedorDTO } from './dto/update_proveedor.dto';
import { FilterProveedorDTO } from './dto/filter_proveedor.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('padmin', 'pbodega')
@Controller('proveedores')
export class ProveedoresController {

    constructor(private servicio: ProveedoresService) {}

    @Get()
    async listar() {
        return this.servicio.listar(); 
    }

    @Get('buscar/:id')
    async buscar(@Param('id') id:number) {
        return this.servicio.buscar(id); 
    }

    @Get('filtrar')
    async filtrar(@Query() queryParams: FilterProveedorDTO) {
        return this.servicio.filtrar(queryParams); 
    }

    @Post('insertar')
    async insertar(@Body() body: CreateProveedorDTO) {
        return this.servicio.insertar(body); 
    }

    @Put('actualizar/:id')
    async actualizar(
        @Param('id') id: number,
        @Body() body: UpdateProveedorDTO
    ) {
        return this.servicio.actualizar(body); 
    }

    @Delete('eliminar/:id')
    async eliminar(@Param('id') id:number) {
        return this.servicio.eliminar(id); 
    }

    @Get('listar/proveedores')
    async listarProveedores() {
        return this.servicio.listarProveedores();
    }

    @Get('filtrar/proveedores')
    async filtrarProveedores(@Query() queryParams: FilterProveedorDTO) {
        return this.servicio.filtrarProveedores(queryParams);
    }

    @Get('buscar/proveedor/:id')
    async buscarProveedor(@Param('id') id:number) {
        return this.servicio.buscarProveedor(id); 
    }


    @Get('listar/proveedores/combo/cedula')
    async listarProveedoresComboCedula() {
        return this.servicio.listarComboProveedorCedula();
    }
    @Get('listar/proveedores/combo/primer/nombre')
    async listarProveedoresComboPrimerNombre() {
        return this.servicio.listarComboProveedorPrimerNombre();
    }
    @Get('listar/proveedores/combo/apellido/paterno')
    async listarProveedoresComboApellidoPaterno() {
        return this.servicio.listarComboProveedorApellidoPaterno();
    }
    @Get('listar/proveedores/combo/email')
    async listarProveedoresComboEmail() {
        return this.servicio.listarComboProveedorEmail();
    }
}