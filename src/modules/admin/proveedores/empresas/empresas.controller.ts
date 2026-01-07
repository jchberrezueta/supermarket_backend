import { Controller, Get, Post, Patch, Delete, Body, UseGuards, Put, Param, Query } from '@nestjs/common';
import { EmpresasService } from './empresas.service';
import { Roles } from 'src/modules/auth/roles.decorator';
import { RolesGuard } from 'src/modules/auth/roles.guard';
import { CreateEmpresaDTO } from './dto/create_empresa.dto';
import { AuthGuard } from '@nestjs/passport';
import { FilterEmpresaDTO } from './dto/filter_empresa.dto';
import { UpdateEmpresaDTO } from './dto/update_empresa.dto';
import { CreateEmpresaPrecioDTO } from './dto/create_precio.dto';
import { UpdateEmpresaPrecioDTO } from './dto/update_precio.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('padmin', 'pbodega')
@Controller('empresas')
export class EmpresasController {

    constructor(private servicio: EmpresasService) {}

    @Get()
    async listar() {
        console.log('lo logramos :)');
        return this.servicio.listar(); 
    }

    @Get('listar/estados')
    getEstados() {
        return this.servicio.listarEstados();
    }

    @Get('buscar/:id')
    async buscar(@Param('id') id:number) {
        return this.servicio.buscar(id); 
    }

    @Get('filtrar')
    async filtrar(@Query() queryParams: FilterEmpresaDTO) {
        return this.servicio.filtrar(queryParams); 
    }

    @Post('insertar')
    async insertar(@Body() body: CreateEmpresaDTO) {
        return this.servicio.insertar(body); 
    }

    @Put('actualizar/:id')
    async actualizar(
        @Param('id') id: number,
        @Body() body: UpdateEmpresaDTO
    ) {
        return this.servicio.actualizar(body); 
    }

    @Delete('eliminar/:id')
    async eliminar(@Param('id') id:number) {
        return this.servicio.eliminar(id); 
    }

    /**
    *  EMPRESAS PRECIOS
    */

    @Get('listar/precios')
    getPrecios() {
        return this.servicio.listarPrecios();
    }

    @Get('listar/precios/:id')
    getPreciosProductosEmpresa(
        @Param('id') id: number
    ) {
        return this.servicio.listarPreciosProductosEmpresa(id);
    }

    @Post('insertar/precio')
    async insertarPrecio(@Body() body: CreateEmpresaPrecioDTO) {
        return this.servicio.insertarPrecio(body); 
    }

    @Put('actualizar/precio/:id')
    async actualizarPrecio(
        @Param('id') id: number,
        @Body() body: UpdateEmpresaPrecioDTO
    ) {
        return this.servicio.actualizarPrecio(body); 
    }
}