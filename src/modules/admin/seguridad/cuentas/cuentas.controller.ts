import { Controller, Get, Post, Delete, Body, Put, Param, Query } from '@nestjs/common';
import { CuentasService } from './cuentas.service';
import { CreateCuentaDto } from './dto/create_cuenta.dto';
import { UpdateCuentaDto } from './dto/update_cuenta.dto';
import { FiltroCuentaDto } from './dto/filtro_cuenta.dto';


@Controller('cuentas')
export class CuentasController {

    constructor(private servicio: CuentasService) {}


    @Get('listar')
    async getCuentas() {
        return await this.servicio.listarCuentas(); 
    }

    @Get('buscar/:id')
    async findCuenta(@Param('id') id:number) {
        return await this.servicio.buscarCuentaPorId(id); 
    }

    @Get('filtrar')
    async filterCuentas(@Query() filtros: FiltroCuentaDto) {
        return await this.servicio.filtrarCuentas(filtros); 
    }

    @Post()
    async create(@Body() createCuentaDto: CreateCuentaDto) {
        return await this.servicio.insertarCuenta(createCuentaDto); 
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() updateCuentaDto: UpdateCuentaDto) {
        return await this.servicio.actualizarCuenta(id, updateCuentaDto); 
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        return await this.servicio.eliminarCuenta(id); 
    }
}