import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  PermissionGuard,
  RequirePermission,
} from 'src/modules/auth/authorization';

import { CreateOpcionDto } from './dto/create_opcion.dto';
import { FilterOpcionDto } from './dto/filter_opcion.dto';
import { UpdateOpcionDto } from './dto/update_opcion.dto';
import { OpcionesService } from './opciones.service';

const RUTA_OPCIONES = '/admin/seguridad/opciones';

@UseGuards(AuthGuard('jwt'), PermissionGuard)
@Controller('opciones')
export class OpcionesController {
  constructor(private readonly opcionesService: OpcionesService) {}

  @RequirePermission(RUTA_OPCIONES, 'listar')
  @Get()
  async listar() {
    return this.opcionesService.listar();
  }

  @RequirePermission(RUTA_OPCIONES, 'listar')
  @Get('buscar/:id')
  async buscar(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.opcionesService.buscar(id);
  }

  @RequirePermission(RUTA_OPCIONES, 'listar')
  @Get('filtrar')
  async filtrar(
    @Query()
    queryParams: FilterOpcionDto,
  ) {
    return this.opcionesService.filtrar(queryParams);
  }

  @RequirePermission(RUTA_OPCIONES, 'insertar')
  @Post('insertar')
  async insertar(
    @Body()
    body: CreateOpcionDto,

    @Req()
    req: any,
  ) {
    return this.opcionesService.insertar(body, req.user.username);
  }

  @RequirePermission(RUTA_OPCIONES, 'modificar')
  @Put('actualizar/:id')
  async actualizar(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    body: UpdateOpcionDto,

    @Req()
    req: any,
  ) {
    body.ideOpci = id;

    return this.opcionesService.actualizar(body, req.user.username);
  }

  @RequirePermission(RUTA_OPCIONES, 'eliminar')
  @Delete('eliminar/:id')
  async eliminar(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.opcionesService.eliminar(id);
  }

  /**
   * COMBOS
   */

  @RequirePermission(RUTA_OPCIONES, 'listar')
  @Get('listar/combo/nombres')
  async listarComboNombres() {
    return this.opcionesService.listarComboNombres();
  }

  @RequirePermission(RUTA_OPCIONES, 'listar')
  @Get('listar/combo/rutas')
  async listarComboRutas() {
    return this.opcionesService.listarComboRutas();
  }

  @RequirePermission(RUTA_OPCIONES, 'listar')
  @Get('listar/combo/niveles')
  async listarComboNiveles() {
    return this.opcionesService.listarComboNiveles();
  }

  @RequirePermission(RUTA_OPCIONES, 'listar')
  @Get('listar/combo/padres')
  async listarComboPadres() {
    return this.opcionesService.listarComboPadres();
  }

  @RequirePermission(RUTA_OPCIONES, 'listar')
  @Get('listar/combo/estados')
  async listarComboEstados() {
    return this.opcionesService.listarComboEstados();
  }

  @RequirePermission(RUTA_OPCIONES, 'listar')
  @Get('listar/combo/visible')
  async listarComboVisible() {
    return this.opcionesService.listarComboVisible();
  }
}
