import { Controller, Get, Post, Patch, Delete, Body, UseGuards, Put, Param, Query } from '@nestjs/common';
import { Roles } from 'src/modules/auth/roles.decorator';
import { RolesGuard } from 'src/modules/auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { UpdateProductoDTO } from './dto/update_producto.dto';
import { CreateProductoDTO } from './dto/create_producto.dto';
import { FilterProductoDTO } from './dto/filter_producto.dto';
import { ProductosService } from './productos.service';


@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('padmin', 'pinventario')
@Controller('productos')
export class ProductosController {

    constructor(private servicio: ProductosService) {}

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
    async filtrar(@Query() queryParams: FilterProductoDTO) {
        return this.servicio.filtrar(queryParams); 
    }

    @Post()
    async insertar(@Body() body: CreateProductoDTO) {
        return this.servicio.insertar(body); 
    }

    @Put('actualizar/:id')
    async actualizar(
        @Param('id') id: number, 
        @Body() body: UpdateProductoDTO
    ) {
        return this.servicio.actualizar(id, body); 
    }

    @Delete('eliminar/:id')
    async eliminar(@Param() id:number) {
        return this.servicio.eliminar(id); 
    }
}