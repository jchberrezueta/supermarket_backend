import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  PermissionGuard,
  RequirePermission,
} from 'src/modules/auth/authorization';
import { FilterMovimientoInventarioDTO } from './dto/filter_movimiento_inventario.dto';
import { MovimientosInventarioService } from './movimientos.service';

const RUTA_MOVIMIENTOS = '/admin/productos/movimientos';

@UseGuards(AuthGuard('jwt'), PermissionGuard)
@Controller('movimientos-inventario')
export class MovimientosInventarioController {
  constructor(
    private readonly movimientosService: MovimientosInventarioService,
  ) {}

  @RequirePermission(RUTA_MOVIMIENTOS, 'listar')
  @Get()
  async listar() {
    return this.movimientosService.listar();
  }

  @RequirePermission(RUTA_MOVIMIENTOS, 'listar')
  @Get('filtrar')
  async filtrar(@Query() filtros: FilterMovimientoInventarioDTO) {
    return this.movimientosService.listar(filtros);
  }

  @RequirePermission(RUTA_MOVIMIENTOS, 'listar')
  @Get('listar/combo/productos')
  async listarComboProductos() {
    return this.movimientosService.listarComboProductos();
  }

  @RequirePermission(RUTA_MOVIMIENTOS, 'listar')
  @Get('listar/combo/tipos')
  async listarComboTipos() {
    return this.movimientosService.listarComboTipos();
  }
}
