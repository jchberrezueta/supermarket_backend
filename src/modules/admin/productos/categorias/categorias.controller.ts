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
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDTO } from './dto/create_categoria.dto';
import { FilterCategoriaDTO } from './dto/filter_categoria.dto';
import { UpdateCategoriaDTO } from './dto/update_categoria.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('padmin', 'pinventario')
@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Get()
  async listar() {
    return this.categoriasService.listar();
  }

  @Get('buscar/:id')
  async buscar(@Param('id', ParseIntPipe) id: number) {
    return this.categoriasService.buscar(id);
  }

  @Get('filtrar')
  async filtrar(@Query() queryParams: FilterCategoriaDTO) {
    return this.categoriasService.filtrar(queryParams);
  }

  @Post('insertar')
  async insertar(@Body() body: CreateCategoriaDTO) {
    return this.categoriasService.insertar(body);
  }

  @Put('actualizar/:id')
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateCategoriaDTO,
  ) {
    body.ideCate = id;

    return this.categoriasService.actualizar(body);
  }

  @Delete('eliminar/:id')
  async eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.categoriasService.eliminar(id);
  }

  /**
   * COMBOS
   */
  @Get('listar/combo/nombre')
  async listarComboCategoriaNombre() {
    return this.categoriasService.listarComboCategoriaNombre();
  }

  @Get('listar/combo/descripcion')
  async listarComboCategoriaDescripcion() {
    return this.categoriasService.listarComboCategoriaDescripcion();
  }

  @Get('listar/combo/categorias')
  async listarComboCategoria() {
    return this.categoriasService.listarComboCategorias();
  }
}
