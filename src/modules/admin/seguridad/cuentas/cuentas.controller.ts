import { Controller, Get, Post, Delete, Body, Put, Param, Query, UseGuards } from '@nestjs/common';
import { CuentasService } from './cuentas.service';
import { CreateCuentaDto } from './dto/create_cuenta.dto';
import { UpdateCuentaDto } from './dto/update_cuenta.dto';
import { FiltroCuentaDto } from './dto/filter_cuenta.dto';
import { Roles } from 'src/modules/auth/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/modules/auth/roles.guard';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('padmin', 'pseguridad')
@Controller('cuentas')
export class CuentasController {

    constructor(private servicio: CuentasService) {}

    @Get()
    async listar() {
        return this.servicio.listar(); 
    }

    @Get('buscar/:id')
    async buscar(@Param('id') id:number) {
        return this.servicio.buscar(id); 
    }

    @Get('filtrar')
    async filtrar(@Query() queryParams: FiltroCuentaDto) {
        return this.servicio.filtrar(queryParams); 
    }

    @Post('insertar')
    async insertar(@Body() body: CreateCuentaDto) {
        return this.servicio.insertar(body); 
    }

    @Put('actualizar/:id')
    async actualizar(
        @Param('id') id: number, 
        @Body() body: UpdateCuentaDto
    ) {
        return this.servicio.actualizar(body); 
    }

    @Delete('eliminar/:id')
    async eliminar(@Param('id') id: number) {
        return this.servicio.eliminar(id); 
    }
}