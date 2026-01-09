import { Controller, Get, Post, Patch, Delete, Body, UseGuards, Put, Param, Query } from '@nestjs/common';
import { Roles } from 'src/modules/auth/roles.decorator';
import { RolesGuard } from 'src/modules/auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { LotesService } from './lotes.service';
import { FilterLoteDTO } from './dto/filter_lote.dto';
import { CreateLoteDTO } from './dto/create_lote.dto';
import { UpdateLoteDTO } from './dto/update_lote.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('padmin', 'pinventario')
@Controller('lotes')
export class LotesController {

    constructor(private servicio: LotesService) {}

    @Get()
    async listar() {
        return this.servicio.listar(); 
    }

    @Get('listar/lotes')
    async listarLotes() {
        return this.servicio.listarLotes(); 
    }

    @Get('buscar/:id')
    async buscar(@Param('id') id:number) {
        return this.servicio.buscar(id); 
    }

    @Get('filtrar/lotes')
    async filtrarLotes(@Query() queryParams: FilterLoteDTO) {
        return this.servicio.filtrarLotes(queryParams); 
    }

    @Get('filtrar')
    async filtrar(@Query() queryParams: FilterLoteDTO) {
        return this.servicio.filtrar(queryParams); 
    }

    @Post('insertar')
    async insertar(@Body() body: CreateLoteDTO) {
        return this.servicio.insertar(body); 
    }

    @Put('actualizar/:id')
    async actualizar(
        @Param('id') id: number, 
        @Body() body: UpdateLoteDTO
    ) {
        return this.servicio.actualizar(body); 
    }

    @Delete('eliminar/:id')
    async eliminar(@Param('id') id:number) {
        return this.servicio.eliminar(id); 
    }

    /**
     * COMBOS
     */
    @Get('listar/combo/productos')
    async listarComboProductos() {
        return this.servicio.listarComboProductos(); 
    }

    @Get('listar/combo/estados')
    async listarComboEstados() {
        return this.servicio.listarComboEstados(); 
    }
}
