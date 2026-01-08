import { Controller, Get, Post, Patch, Delete, Body, UseGuards, Put, Param, Query } from '@nestjs/common';
import { Roles } from 'src/modules/auth/roles.decorator';
import { RolesGuard } from 'src/modules/auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { RolesService } from './roles.service';
import { FilterRolDTO } from './dto/filter_rol.dto';
import { CreateRolDTO } from './dto/create_rol.dto';
import { UpdateRolDTO } from './dto/update_rol.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('padmin', 'prrhh')
@Controller('roles')
export class RolesController {

    constructor(private servicio: RolesService) {}

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
    async filtrar(@Query() queryParams: FilterRolDTO) {
        return this.servicio.filtrar(queryParams); 
    }

    @Post('insertar')
    async insertar(@Body() body: CreateRolDTO) {
        return this.servicio.insertar(body); 
    }

    @Put('actualizar/:id')
    async actualizar(
        @Param('id') id: number, 
        @Body() body: UpdateRolDTO
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
    @Get('listar/combo/roles')
    async listarComboRoles() {
        return this.servicio.listarComboRoles(); 
    }
    @Get('listar/combo/nombres')
    async listarComboNombres() {
        return this.servicio.listarComboNombres(); 
    }
    @Get('listar/combo/descripcion')
    async listarComboDescripcion() {
        return this.servicio.listarComboDescripciones(); 
    }
}