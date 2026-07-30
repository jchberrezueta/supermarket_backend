import { ApiResponseFactory } from '@common/index';
import { Injectable } from '@nestjs/common';
import {
  FilterMovimientoInventarioDTO,
  TIPOS_MOVIMIENTO_INVENTARIO,
} from './dto/filter_movimiento_inventario.dto';
import { MovimientosInventarioMapper } from './movimientos.mapper';
import { MovimientosInventarioRepository } from './movimientos.repository';

@Injectable()
export class MovimientosInventarioService {
  constructor(
    private readonly movimientosRepository: MovimientosInventarioRepository,
  ) {}

  async listar(filtros: FilterMovimientoInventarioDTO = {}) {
    const movimientos = await this.movimientosRepository.listar(filtros);

    return ApiResponseFactory.legacyRead(
      MovimientosInventarioMapper.toRows(movimientos),
      'Movimientos de inventario obtenidos correctamente.',
    );
  }

  async listarComboProductos() {
    return this.movimientosRepository.listarProductos();
  }

  async listarComboTipos() {
    return TIPOS_MOVIMIENTO_INVENTARIO.map((tipo) => ({
      value: tipo,
      label: MovimientosInventarioMapper.tipoLabel(tipo),
    }));
  }
}
