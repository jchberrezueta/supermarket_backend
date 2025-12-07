import { Controller, Get, Post, Patch, Delete, Body, UseGuards, Put, Param, Query } from '@nestjs/common';
import { EmpresasService } from './empresas.service';
import { Roles } from 'src/modules/auth/roles.decorator';
import { RolesGuard } from 'src/modules/auth/roles.guard';
import { CreateEmpresaDTO } from './dto/create_empresa.dto';
import { AuthGuard } from '@nestjs/passport';
import { FilterEmpresaDTO } from './dto/filter_empresa.dto';
import { EmpleadosService } from './empleados.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('padmin', 'pnomina')
@Controller('empleados')
export class EmpleadosController {

    constructor(private servicio: EmpleadosService) {}

    @Get()
    async listar() {
        console.log('lo logramos :)');
        return this.servicio.listar(); 
    }

    @Get('buscar/:id')
    async buscar(@Param('id') id:number) {
        return this.servicio.buscar(id); 
    }

    @Get('filtrar')
    async filtrar(@Query() queryParams: FilterEmpresaDTO) {
        return this.servicio.filtrar(queryParams); 
    }

    @Post()
    async insertar(@Body() empresa: CreateEmpresaDTO) {
        return this.servicio.insertar(empresa); 
    }

    @Put('actualizar/:id')
    async actualizar(
        @Param('id') id: number, 
        @Body() empresa: CreateEmpresaDTO
    ) {
        return this.servicio.actualizar(id, empresa); 
    }

    @Delete('eliminar/:id')
    async eliminar(@Param() id:number) {
        return this.servicio.eliminar(id); 
    }
}