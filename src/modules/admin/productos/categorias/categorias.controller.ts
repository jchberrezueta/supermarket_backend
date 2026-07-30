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
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDTO } from './dto/create_categoria.dto';
import { FilterCategoriaDTO } from './dto/filter_categoria.dto';
import { UpdateCategoriaDTO } from './dto/update_categoria.dto';

const RUTA_CATEGORIAS = '/admin/productos/categorias';

@UseGuards(AuthGuard('jwt'), PermissionGuard)
@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @RequirePermission(RUTA_CATEGORIAS, 'listar')
  @Get()
  async listar() {
    return this.categoriasService.listar();
  }

  @RequirePermission(RUTA_CATEGORIAS, 'listar')
  @Get('buscar/:id')
  async buscar(@Param('id', ParseIntPipe) id: number) {
    return this.categoriasService.buscar(id);
  }

  @RequirePermission(RUTA_CATEGORIAS, 'listar')
  @Get('filtrar')
  async filtrar(@Query() queryParams: FilterCategoriaDTO) {
    return this.categoriasService.filtrar(queryParams);
  }

  @RequirePermission(RUTA_CATEGORIAS, 'insertar')
  @Post('insertar')
  async insertar(@Body() body: CreateCategoriaDTO) {
    return this.categoriasService.insertar(body);
  }

  @RequirePermission(RUTA_CATEGORIAS, 'modificar')
  @Put('actualizar/:id')
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateCategoriaDTO,
  ) {
    body.ideCate = id;

    return this.categoriasService.actualizar(body);
  }

  @RequirePermission(RUTA_CATEGORIAS, 'eliminar')
  @Delete('eliminar/:id')
  async eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.categoriasService.eliminar(id);
  }

  /**
   * COMBOS
   */
  @RequirePermission(RUTA_CATEGORIAS, 'listar')
  @Get('listar/combo/nombre')
  async listarComboCategoriaNombre() {
    return this.categoriasService.listarComboCategoriaNombre();
  }

  @RequirePermission(RUTA_CATEGORIAS, 'listar')
  @Get('listar/combo/descripcion')
  async listarComboCategoriaDescripcion() {
    return this.categoriasService.listarComboCategoriaDescripcion();
  }

  @RequirePermission(RUTA_CATEGORIAS, 'listar')
  @Get('listar/combo/categorias')
  async listarComboCategoria() {
    return this.categoriasService.listarComboCategorias();
  }
}
