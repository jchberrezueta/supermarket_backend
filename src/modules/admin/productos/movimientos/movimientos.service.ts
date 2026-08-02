import { ApiResponseFactory, IdUtil } from '@common/index';

import { Injectable, NotFoundException } from '@nestjs/common';
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

  async buscar(id: number) {
    const ideMovi = IdUtil.requireId(id, 'El ID del movimiento no es válido.');

    const movimientos = await this.movimientosRepository.listar({
      ideMovi,
    });

    const movimiento = movimientos[0];

    if (!movimiento) {
      throw new NotFoundException(
        'No se encontró el movimiento de inventario indicado.',
      );
    }

    return ApiResponseFactory.legacyRead(
      MovimientosInventarioMapper.toRows([movimiento]),
      'Movimiento de inventario encontrado correctamente.',
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
