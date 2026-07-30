import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  PermissionGuard,
  RequirePermission,
} from 'src/modules/auth/authorization';
import { FilterLoteDTO } from './dto/filter_lote.dto';
import { LotesService } from './lotes.service';

const RUTA_LOTES = '/admin/productos/lotes';

@UseGuards(AuthGuard('jwt'), PermissionGuard)
@Controller('lotes')
export class LotesController {
  constructor(private readonly lotesService: LotesService) {}

  @RequirePermission(RUTA_LOTES, 'listar')
  @Get()
  async listar() {
    return this.lotesService.listar();
  }

  @RequirePermission(RUTA_LOTES, 'listar')
  @Get('listar/lotes')
  async listarLotes() {
    return this.lotesService.listarLotes();
  }

  @RequirePermission(RUTA_LOTES, 'listar')
  @Get('buscar/:id')
  async buscar(@Param('id', ParseIntPipe) id: number) {
    return this.lotesService.buscar(id);
  }

  @RequirePermission(RUTA_LOTES, 'listar')
  @Get('filtrar/lotes')
  async filtrarLotes(@Query() queryParams: FilterLoteDTO) {
    return this.lotesService.filtrarLotes(queryParams);
  }

  @RequirePermission(RUTA_LOTES, 'listar')
  @Get('filtrar')
  async filtrar(@Query() queryParams: FilterLoteDTO) {
    return this.lotesService.filtrar(queryParams);
  }

  /**
   * COMBOS PARA CONSULTA Y FILTROS
   */
  @RequirePermission(RUTA_LOTES, 'listar')
  @Get('listar/combo/productos')
  async listarComboProductos() {
    return this.lotesService.listarComboProductos();
  }

  @RequirePermission(RUTA_LOTES, 'listar')
  @Get('listar/combo/estados')
  async listarComboEstados() {
    return this.lotesService.listarComboEstados();
  }
}
