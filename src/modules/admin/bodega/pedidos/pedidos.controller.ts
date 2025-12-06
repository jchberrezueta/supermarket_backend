import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/modules/auth/roles.guard';
import { Roles } from 'src/modules/auth/roles.decorator';
import { CreatePedidoDTO } from './dto/create_pedido.dto';
import { FilterPedidoDTO } from './dto/filter_pedido.dto';
import { UpdatePedidoDTO } from './dto/update_pedido.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('padmin', 'pbodega')
@Controller('pedidos')
export class PedidosController {
    constructor(private servicio: PedidosService) {}

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
    async filtrar(@Query() queryParams: FilterPedidoDTO) {
        return this.servicio.filtrar(queryParams); 
    }

    @Post()
    async insertar(@Body() body: CreatePedidoDTO) {
        return this.servicio.insertar(body); 
    }

    @Put('actualizar/:id')
    async actualizar(
        @Param('id') id: number, 
        @Body() body: UpdatePedidoDTO
    ) {
        return this.servicio.actualizar(id, body); 
    }

    @Delete('eliminar/:id')
    async eliminar(@Param() id:number) {
        return this.servicio.eliminar(id); 
    }
}