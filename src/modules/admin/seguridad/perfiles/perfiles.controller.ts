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

import { CreatePerfilDto } from './dto/create_perfil.dto';
import { FilterPerfilDto } from './dto/filter_perfil.dto';
import { UpdatePerfilDto } from './dto/update_perfil.dto';
import { PerfilesService } from './perfiles.service';
import { GuardarPermisosPerfilDto } from './dto/guardar_permisos_perfil.dto';

const RUTA_PERFILES = '/admin/seguridad/perfiles';

@UseGuards(AuthGuard('jwt'), PermissionGuard)
@Controller('perfiles')
export class PerfilesController {
  constructor(private readonly perfilesService: PerfilesService) {}

  @RequirePermission(RUTA_PERFILES, 'listar')
  @Get()
  async listar() {
    return this.perfilesService.listar();
  }

  @RequirePermission(RUTA_PERFILES, 'listar')
  @Get('buscar/:id')
  async buscar(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.perfilesService.buscar(id);
  }

  @RequirePermission(RUTA_PERFILES, 'listar')
  @Get('filtrar')
  async filtrar(
    @Query()
    queryParams: FilterPerfilDto,
  ) {
    return this.perfilesService.filtrar(queryParams);
  }

  @RequirePermission(RUTA_PERFILES, 'insertar')
  @Post('insertar')
  async insertar(
    @Body()
    body: CreatePerfilDto,

    @Req()
    req: any,
  ) {
    return this.perfilesService.insertar(body, req.user.username);
  }

  @RequirePermission(RUTA_PERFILES, 'modificar')
  @Put('actualizar/:id')
  async actualizar(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    body: UpdatePerfilDto,

    @Req()
    req: any,
  ) {
    body.idePerf = id;

    return this.perfilesService.actualizar(body, req.user.username);
  }

  @RequirePermission(RUTA_PERFILES, 'listar')
  @Get(':id/permisos')
  async listarPermisos(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.perfilesService.listarPermisos(id);
  }

  @RequirePermission(RUTA_PERFILES, 'modificar')
  @Put(':id/permisos')
  async guardarPermisos(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    body: GuardarPermisosPerfilDto,

    @Req()
    req: any,
  ) {
    return this.perfilesService.guardarPermisos(id, body, req.user.username);
  }

  @RequirePermission(RUTA_PERFILES, 'eliminar')
  @Delete('eliminar/:id')
  async eliminar(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.perfilesService.eliminar(id);
  }

  /**
   * JOINS
   */

  @RequirePermission(RUTA_PERFILES, 'listar')
  @Get('listar/perfiles')
  async listarPerfiles() {
    return this.perfilesService.listarPerfiles();
  }

  @RequirePermission(RUTA_PERFILES, 'listar')
  @Get('filtrar/perfiles')
  async filtrarPerfiles(
    @Query()
    queryParams: FilterPerfilDto,
  ) {
    return this.perfilesService.filtrarPerfiles(queryParams);
  }

  /**
   * COMBOS
   */

  @RequirePermission(RUTA_PERFILES, 'listar')
  @Get('listar/combo/perfiles')
  async listarComboPerfiles() {
    return this.perfilesService.listarComboPerfiles();
  }

  @RequirePermission(RUTA_PERFILES, 'listar')
  @Get('listar/combo/nombres')
  async listarComboNombres() {
    return this.perfilesService.listarComboNombres();
  }

  @RequirePermission(RUTA_PERFILES, 'listar')
  @Get('listar/combo/descripciones')
  async listarComboDescripcion() {
    return this.perfilesService.listarComboDescripcion();
  }

  @RequirePermission(RUTA_PERFILES, 'listar')
  @Get('listar/combo/roles')
  async listarComboRoles() {
    return this.perfilesService.listarComboRoles();
  }
}
