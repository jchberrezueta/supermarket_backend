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
import { CreateMarcaDTO } from './dto/create_marca.dto';
import { FilterMarcaDTO } from './dto/filter_marca.dto';
import { UpdateMarcaDTO } from './dto/update_marca.dto';
import { MarcasService } from './marcas.service';

const RUTA_MARCAS = '/admin/productos/marcas';

@UseGuards(AuthGuard('jwt'), PermissionGuard)
@Controller('marcas')
export class MarcasController {
  constructor(private readonly marcasService: MarcasService) {}

  @RequirePermission(RUTA_MARCAS, 'listar')
  @Get()
  async listar() {
    return this.marcasService.listar();
  }

  @RequirePermission(RUTA_MARCAS, 'listar')
  @Get('buscar/:id')
  async buscar(@Param('id', ParseIntPipe) id: number) {
    return this.marcasService.buscar(id);
  }

  @RequirePermission(RUTA_MARCAS, 'listar')
  @Get('filtrar')
  async filtrar(@Query() queryParams: FilterMarcaDTO) {
    return this.marcasService.filtrar(queryParams);
  }

  @RequirePermission(RUTA_MARCAS, 'insertar')
  @Post('insertar')
  async insertar(@Body() body: CreateMarcaDTO) {
    return this.marcasService.insertar(body);
  }

  @RequirePermission(RUTA_MARCAS, 'modificar')
  @Put('actualizar/:id')
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateMarcaDTO,
  ) {
    body.ideMarc = id;

    return this.marcasService.actualizar(body);
  }

  @RequirePermission(RUTA_MARCAS, 'eliminar')
  @Delete('eliminar/:id')
  async eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.marcasService.eliminar(id);
  }

  /**
   * COMBOS
   */
  @RequirePermission(RUTA_MARCAS, 'listar')
  @Get('listar/combo/nombre')
  async listarComboCategoriaNombre() {
    return this.marcasService.listarComboNombre();
  }

  @RequirePermission(RUTA_MARCAS, 'listar')
  @Get('listar/combo/pais')
  async listarComboCategoriaPais() {
    return this.marcasService.listarComboPais();
  }

  @RequirePermission(RUTA_MARCAS, 'listar')
  @Get('listar/combo/calidad')
  async listarComboCategoriaCalidad() {
    return this.marcasService.listarComboCalidad();
  }

  @RequirePermission(RUTA_MARCAS, 'listar')
  @Get('listar/combo/marcas')
  async listarComboMarcas() {
    return this.marcasService.listarComboMarcas();
  }
}
