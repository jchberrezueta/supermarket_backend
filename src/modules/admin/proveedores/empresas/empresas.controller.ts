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
import { Roles } from 'src/modules/auth/roles.decorator';
import { RolesGuard } from 'src/modules/auth/roles.guard';
import { CreateEmpresaDTO } from './dto/create_empresa.dto';
import { CreateEmpresaPrecioDTO } from './dto/create_precio.dto';
import { FilterEmpresaDTO } from './dto/filter_empresa.dto';
import { UpdateEmpresaDTO } from './dto/update_empresa.dto';
import { UpdateEmpresaPrecioDTO } from './dto/update_precio.dto';
import { EmpresasService } from './empresas.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('padmin', 'pbodega')
@Controller('empresas')
export class EmpresasController {
  constructor(private readonly empresasService: EmpresasService) {}

  @Get()
  async listar() {
    return this.empresasService.listar();
  }

  @Get('buscar/:id')
  async buscar(@Param('id', ParseIntPipe) id: number) {
    return this.empresasService.buscar(id);
  }

  @Get('filtrar')
  async filtrar(@Query() queryParams: FilterEmpresaDTO) {
    return this.empresasService.filtrar(queryParams);
  }

  @Post('insertar')
  async insertar(@Body() body: CreateEmpresaDTO) {
    return this.empresasService.insertar(body);
  }

  @Put('actualizar/:id')
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateEmpresaDTO,
  ) {
    body.ideEmp = id;

    return this.empresasService.actualizar(body);
  }

  @Delete('eliminar/:id')
  async eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.empresasService.eliminar(id);
  }

  /**
   * COMBOS
   */
  @Get('listar/combo/empresas')
  async listarComboEmpresas() {
    return this.empresasService.listarComboEmpresas();
  }

  @Get('listar/combo/empresas/estados')
  async listarEstados() {
    return this.empresasService.listarEstados();
  }

  /**
   * EMPRESAS PRECIOS
   */
  @Get('listar/precios')
  async listarPrecios() {
    return this.empresasService.listarPrecios();
  }

  @Get('listar/precios/:id')
  async listarPreciosProductosEmpresa(@Param('id', ParseIntPipe) id: number) {
    return this.empresasService.listarPreciosProductosEmpresa(id);
  }

  @Post('insertar/precio')
  async insertarPrecio(@Body() body: CreateEmpresaPrecioDTO) {
    return this.empresasService.insertarPrecio(body);
  }

  @Put('actualizar/precio/:id')
  async actualizarPrecio(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateEmpresaPrecioDTO,
  ) {
    body.ideEmprProd = id;

    return this.empresasService.actualizarPrecio(body);
  }
}
