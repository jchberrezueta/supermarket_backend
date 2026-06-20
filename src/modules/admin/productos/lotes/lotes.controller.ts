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
import { CreateLoteDTO } from './dto/create_lote.dto';
import { FilterLoteDTO } from './dto/filter_lote.dto';
import { UpdateLoteDTO } from './dto/update_lote.dto';
import { LotesService } from './lotes.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('padmin', 'pinventario')
@Controller('lotes')
export class LotesController {
  constructor(private readonly lotesService: LotesService) {}

  @Get()
  async listar() {
    return this.lotesService.listar();
  }

  @Get('listar/lotes')
  async listarLotes() {
    return this.lotesService.listarLotes();
  }

  @Get('buscar/:id')
  async buscar(@Param('id', ParseIntPipe) id: number) {
    return this.lotesService.buscar(id);
  }

  @Get('filtrar/lotes')
  async filtrarLotes(@Query() queryParams: FilterLoteDTO) {
    return this.lotesService.filtrarLotes(queryParams);
  }

  @Get('filtrar')
  async filtrar(@Query() queryParams: FilterLoteDTO) {
    return this.lotesService.filtrar(queryParams);
  }

  @Post('insertar')
  async insertar(@Body() body: CreateLoteDTO) {
    return this.lotesService.insertar(body);
  }

  @Put('actualizar/:id')
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateLoteDTO,
  ) {
    body.ideLote = id;

    return this.lotesService.actualizar(body);
  }

  @Delete('eliminar/:id')
  async eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.lotesService.eliminar(id);
  }

  /**
   * COMBOS
   */
  @Get('listar/combo/productos')
  async listarComboProductos() {
    return this.lotesService.listarComboProductos();
  }

  @Get('listar/combo/estados')
  async listarComboEstados() {
    return this.lotesService.listarComboEstados();
  }
}
