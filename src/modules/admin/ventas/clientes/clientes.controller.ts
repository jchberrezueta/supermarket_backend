import { Controller, Get, Post, Patch, Delete, Body, UseGuards, Put, Param, Query } from '@nestjs/common';
import { Roles } from 'src/modules/auth/roles.decorator';
import { RolesGuard } from 'src/modules/auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { ClientesService } from './clientes.service';
import { FilterClienteDTO } from './dto/filter_cliente.dto';
import { CreateClienteDTO } from './dto/create_cliente.dto';
import { UpdateClienteDTO } from './dto/update_cliente.dto';
import { toArray } from 'rxjs';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('padmin', 'pventas')
@Controller('clientes')
export class ClientesController {

    constructor(private servicio: ClientesService) {}

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
    async filtrar(@Query() queryParams: FilterClienteDTO) {
        return this.servicio.filtrar(queryParams); 
    }

    @Post('insertar')
    async insertar(@Body() body: CreateClienteDTO) {
        return this.servicio.insertar(body); 
    }

    @Put('actualizar/:id')
    async actualizar(
        @Param('id') id: number,
        @Body() body: UpdateClienteDTO
    ) {
        return this.servicio.actualizar(body); 
    }

    @Delete('eliminar/:id')
    async eliminar(@Param('id') id:number) {
        return this.servicio.eliminar(id); 
    }
}