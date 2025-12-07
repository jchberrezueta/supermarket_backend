import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/modules/auth/roles.guard';
import { Roles } from 'src/modules/auth/roles.decorator';
import { EntregasService } from './entregas.service';
import { FilterEntregaDTO } from './dto/filter_entrega.dto';
import { CreateEntregaDTO } from './dto/create_entrega.dto';
import { UpdateEntregaDTO } from './dto/update_entrega.dto';


@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('padmin', 'pbodega')
@Controller('entregas')
export class EntregasController {
    constructor(private servicio: EntregasService) {}

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
    async filtrar(@Query() queryParams: FilterEntregaDTO) {
        console.log(':)');
        return this.servicio.filtrar(queryParams); 
    }

    @Post()
    async insertar(@Body() body: CreateEntregaDTO) {
        return this.servicio.insertar(body); 
    }

    @Put('actualizar/:id')
    async actualizar(
        @Param('id') id: number, 
        @Body() body: UpdateEntregaDTO
    ) {
        return this.servicio.actualizar(id, body); 
    }

    @Delete('eliminar/:id')
    async eliminar(@Param() id:number) {
        return this.servicio.eliminar(id); 
    }
}