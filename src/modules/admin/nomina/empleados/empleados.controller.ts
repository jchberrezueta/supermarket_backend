import { Controller, Get, Post, Patch, Delete, Body, UseGuards, Put, Param, Query } from '@nestjs/common';
import { Roles } from 'src/modules/auth/roles.decorator';
import { RolesGuard } from 'src/modules/auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { EmpleadosService } from './empleados.service';
import { FilterEmpleadoDTO } from './dto/filter_empleado.dto';
import { CreateEmpleadoDTO } from './dto/create_empleado.dto';
import { UpdateEmpleadoDTO } from './dto/update_empleado.dto';

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
    async filtrar(@Query() queryParams: FilterEmpleadoDTO) {
        return this.servicio.filtrar(queryParams); 
    }

    @Post()
    async insertar(@Body() body: CreateEmpleadoDTO) {
        return this.servicio.insertar(body); 
    }

    @Put('actualizar/:id')
    async actualizar(
        @Param('id') id: number, 
        @Body() body: UpdateEmpleadoDTO
    ) {
        return this.servicio.actualizar(id, body); 
    }

    @Delete('eliminar/:id')
    async eliminar(@Param() id:number) {
        return this.servicio.eliminar(id); 
    }
}