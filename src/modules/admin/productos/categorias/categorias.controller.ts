import { Controller, Get, Post, Patch, Delete, Body, UseGuards, Put, Param, Query } from '@nestjs/common';
import { Roles } from 'src/modules/auth/roles.decorator';
import { RolesGuard } from 'src/modules/auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { FilterCategoriaDTO } from './dto/filter_categoria.dto';
import { CreateCategoriaDTO } from './dto/create_categoria.dto';
import { UpdateCategoriaDTO } from './dto/update_categoria.dto';
import { CategoriasService } from './categorias.service';


@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('padmin', 'pinventario')
@Controller('categorias')
export class CategoriasController {

    constructor(private servicio: CategoriasService) {}

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
    async filtrar(@Query() queryParams: FilterCategoriaDTO) {
        return this.servicio.filtrar(queryParams); 
    }

    @Post()
    async insertar(@Body() body: CreateCategoriaDTO) {
        return this.servicio.insertar(body); 
    }

    @Put('actualizar/:id')
    async actualizar(
        @Param('id') id: number, 
        @Body() body: UpdateCategoriaDTO
    ) {
        return this.servicio.actualizar(id, body); 
    }

    @Delete('eliminar/:id')
    async eliminar(@Param() id:number) {
        return this.servicio.eliminar(id); 
    }
}