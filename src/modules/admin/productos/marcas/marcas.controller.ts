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
import { CreateMarcaDTO } from './dto/create_marca.dto';
import { FilterMarcaDTO } from './dto/filter_marca.dto';
import { UpdateMarcaDTO } from './dto/update_marca.dto';
import { MarcasService } from './marcas.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('padmin', 'pinventario')
@Controller('marcas')
export class MarcasController {
  constructor(private readonly marcasService: MarcasService) {}

  @Get()
  async listar() {
    return this.marcasService.listar();
  }

  @Get('buscar/:id')
  async buscar(@Param('id', ParseIntPipe) id: number) {
    return this.marcasService.buscar(id);
  }

  @Get('filtrar')
  async filtrar(@Query() queryParams: FilterMarcaDTO) {
    return this.marcasService.filtrar(queryParams);
  }

  @Post('insertar')
  async insertar(@Body() body: CreateMarcaDTO) {
    return this.marcasService.insertar(body);
  }

  @Put('actualizar/:id')
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateMarcaDTO,
  ) {
    body.ideMarc = id;

    return this.marcasService.actualizar(body);
  }

  @Delete('eliminar/:id')
  async eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.marcasService.eliminar(id);
  }

  /**
   * COMBOS
   */
  @Get('listar/combo/nombre')
  async listarComboCategoriaNombre() {
    return this.marcasService.listarComboNombre();
  }

  @Get('listar/combo/pais')
  async listarComboCategoriaPais() {
    return this.marcasService.listarComboPais();
  }

  @Get('listar/combo/calidad')
  async listarComboCategoriaCalidad() {
    return this.marcasService.listarComboCalidad();
  }

  @Get('listar/combo/marcas')
  async listarComboMarcas() {
    return this.marcasService.listarComboMarcas();
  }
}
