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
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  PermissionGuard,
  RequirePermission,
} from 'src/modules/auth/authorization';
import { CreateEmpresaDTO } from './dto/create_empresa.dto';
import { CreateEmpresaPrecioDTO } from './dto/create_precio.dto';
import { FilterEmpresaDTO } from './dto/filter_empresa.dto';
import { UpdateEmpresaDTO } from './dto/update_empresa.dto';
import { UpdateEmpresaPrecioDTO } from './dto/update_precio.dto';
import { EmpresasService } from './empresas.service';

const RUTA_EMPRESAS = '/admin/proveedores/empresas';
const RUTA_PRECIOS_EMPRESA = '/admin/proveedores/empresas/precios';

@UseGuards(AuthGuard('jwt'), PermissionGuard)
@Controller('empresas')
export class EmpresasController {
  constructor(private readonly empresasService: EmpresasService) {}

  @RequirePermission(RUTA_EMPRESAS, 'listar')
  @Get()
  async listar() {
    return this.empresasService.listar();
  }

  @RequirePermission(RUTA_EMPRESAS, 'listar')
  @Get('buscar/:id')
  async buscar(@Param('id', ParseIntPipe) id: number) {
    return this.empresasService.buscar(id);
  }

  @RequirePermission(RUTA_EMPRESAS, 'listar')
  @Get('buscar/activa/:id')
  async getEmpresaActiva(@Param('id', ParseIntPipe) id: number) {
    return this.empresasService.buscarActiva(id);
  }

  @RequirePermission(RUTA_EMPRESAS, 'listar')
  @Get('filtrar')
  async filtrar(@Query() queryParams: FilterEmpresaDTO) {
    return this.empresasService.filtrar(queryParams);
  }

  @RequirePermission(RUTA_EMPRESAS, 'insertar')
  @Post('insertar')
  async insertar(@Body() body: CreateEmpresaDTO) {
    return this.empresasService.insertar(body);
  }

  @RequirePermission(RUTA_EMPRESAS, 'modificar')
  @Put('actualizar/:id')
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateEmpresaDTO,
  ) {
    body.ideEmp = id;
    return this.empresasService.actualizar(body);
  }

  @RequirePermission(RUTA_EMPRESAS, 'eliminar')
  @Delete('eliminar/:id')
  async eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.empresasService.eliminar(id);
  }

  /**
   * COMBOS
   */
  @RequirePermission(RUTA_EMPRESAS, 'listar')
  @Get('listar/combo/empresas')
  async listarComboEmpresas() {
    return this.empresasService.listarComboEmpresas();
  }

  @RequirePermission(RUTA_EMPRESAS, 'listar')
  @Get('listar/combo/empresas/activas')
  async listarComboEmpresasActivas() {
    return this.empresasService.listarComboEmpresasActivas();
  }

  @RequirePermission(RUTA_EMPRESAS, 'listar')
  @Get('listar/combo/empresas/responsables')
  async listarComboResponsable() {
    return this.empresasService.listarComboResponsable();
  }

  @RequirePermission(RUTA_EMPRESAS, 'listar')
  @Get('listar/combo/empresas/estados')
  async listarEstados() {
    return this.empresasService.listarEstados();
  }

  /**
   * EMPRESAS PRECIOS
   */
  @RequirePermission(RUTA_PRECIOS_EMPRESA, 'listar')
  @Get('listar/precios')
  async listarPrecios() {
    return this.empresasService.listarPrecios();
  }

  @RequirePermission(RUTA_PRECIOS_EMPRESA, 'listar')
  @Get('listar/precios/estados')
  async listarPreciosEstados() {
    return this.empresasService.listarPreciosEstados();
  }

  @RequirePermission(RUTA_PRECIOS_EMPRESA, 'listar')
  @Get('listar/precios/:id')
  async listarPreciosProductosEmpresa(@Param('id', ParseIntPipe) id: number) {
    return this.empresasService.listarPreciosProductosEmpresa(id);
  }

  @RequirePermission(RUTA_PRECIOS_EMPRESA, 'insertar')
  @Post('insertar/precio')
  async insertarPrecio(@Body() body: CreateEmpresaPrecioDTO) {
    return this.empresasService.insertarPrecio(body);
  }

  @RequirePermission(RUTA_PRECIOS_EMPRESA, 'modificar')
  @Put('actualizar/precio/:id')
  async actualizarPrecio(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateEmpresaPrecioDTO,
  ) {
    body.ideEmprProd = id;

    return this.empresasService.actualizarPrecio(body);
  }
}
