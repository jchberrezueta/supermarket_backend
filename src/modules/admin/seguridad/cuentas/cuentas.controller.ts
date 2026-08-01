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

import { CuentasService } from './cuentas.service';
import { CreateCuentaDto } from './dto/create_cuenta.dto';
import { FiltroCuentaDto } from './dto/filter_cuenta.dto';
import { ResetCuentaPasswordDto } from './dto/reset_cuenta_password.dto';
import { UpdateCuentaDto } from './dto/update_cuenta.dto';

const RUTA_CUENTAS = '/admin/seguridad/cuentas';

@UseGuards(AuthGuard('jwt'), PermissionGuard)
@Controller('cuentas')
export class CuentasController {
  constructor(private readonly servicio: CuentasService) {}

  @RequirePermission(RUTA_CUENTAS, 'listar')
  @Get()
  async listar() {
    return this.servicio.listar();
  }

  @RequirePermission(RUTA_CUENTAS, 'listar')
  @Get('buscar/:id')
  async buscar(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.servicio.buscar(id);
  }

  @RequirePermission(RUTA_CUENTAS, 'listar')
  @Get('filtrar')
  async filtrar(
    @Query()
    queryParams: FiltroCuentaDto,
  ) {
    return this.servicio.filtrar(queryParams);
  }

  @RequirePermission(RUTA_CUENTAS, 'insertar')
  @Post('insertar')
  async insertar(
    @Body()
    body: CreateCuentaDto,

    @Req()
    req: any,
  ) {
    return this.servicio.insertar(body, req.user.username);
  }

  @RequirePermission(RUTA_CUENTAS, 'modificar')
  @Put('actualizar/:id')
  async actualizar(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    body: UpdateCuentaDto,

    @Req()
    req: any,
  ) {
    body.ideCuen = id;

    return this.servicio.actualizar(body, req.user.username);
  }

  @RequirePermission(RUTA_CUENTAS, 'modificar')
  @Post(':id/restablecer-clave')
  async restablecerClave(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    body: ResetCuentaPasswordDto,

    @Req()
    req: any,
  ) {
    return this.servicio.restablecerClaveAdministrativamente(
      id,
      body.claveTemporal,
      req.user.username,
    );
  }

  @RequirePermission(RUTA_CUENTAS, 'eliminar')
  @Delete('eliminar/:id')
  async eliminar(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.servicio.eliminar(id);
  }

  /**
   * JOINS
   */

  @RequirePermission(RUTA_CUENTAS, 'listar')
  @Get('listar/cuentas')
  async listarCuentas() {
    return this.servicio.listarCuentas();
  }

  @RequirePermission(RUTA_CUENTAS, 'listar')
  @Get('filtrar/cuentas')
  async filtrarCuentas(
    @Query()
    queryParams: FiltroCuentaDto,
  ) {
    return this.servicio.filtrarCuentas(queryParams);
  }

  /**
   * COMBOS
   */

  @RequirePermission(RUTA_CUENTAS, 'listar')
  @Get('listar/combo/cuentas')
  async listarComboCuentas() {
    return this.servicio.listarComboCuentas();
  }

  @RequirePermission(RUTA_CUENTAS, 'listar')
  @Get('listar/combo/usuarios')
  async listarComboUsuarios() {
    return this.servicio.listarComboUsuarios();
  }

  @RequirePermission(RUTA_CUENTAS, 'listar')
  @Get('listar/combo/estados')
  async listarComboEstados() {
    return this.servicio.listarComboEstados();
  }

  @RequirePermission(RUTA_CUENTAS, 'listar')
  @Get('listar/combo/cambio/clave')
  async listarComboCambioClaves() {
    return this.servicio.listarComboCambioClaves();
  }

  @RequirePermission(RUTA_CUENTAS, 'listar')
  @Get('listar/combo/empleados')
  async listarComboEmpleados() {
    return this.servicio.listarComboEmpleados();
  }

  @RequirePermission(RUTA_CUENTAS, 'listar')
  @Get('listar/combo/perfiles')
  async listarComboPerfiles() {
    return this.servicio.listarComboPerfiles();
  }
}
