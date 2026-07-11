import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ApiResponseFactory, ComboMapper, IdUtil } from '@common/index';
import { DataSource } from 'typeorm';
import { FilterLoteDTO } from './dto/filter_lote.dto';
import { LotesMapper } from './lotes.mapper';
import { LotesRepository } from './lotes.repository';

@Injectable()
export class LotesService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly lotesRepository: LotesRepository,
  ) {}

  async listar() {
    const lotes = await this.dataSource.transaction((manager) =>
      this.lotesRepository.listar(manager),
    );

    return ApiResponseFactory.legacyRead(
      LotesMapper.toRows(lotes),
      'Listado de lotes obtenido',
    );
  }

  async listarLotes() {
    return this.listar();
  }

  async buscar(id: number) {
    const ideLote = IdUtil.requireId(id, 'El ID del lote no es válido.');

    const lote = await this.dataSource.transaction((manager) =>
      this.lotesRepository.buscarPorId(ideLote, manager),
    );

    return ApiResponseFactory.legacyRead(
      lote ? [LotesMapper.toRow(lote)] : [],
      'Lote encontrado',
    );
  }

  async filtrar(queryParams: FilterLoteDTO) {
    const lotes = await this.dataSource.transaction((manager) =>
      this.lotesRepository.filtrar(queryParams, manager),
    );

    return ApiResponseFactory.legacyRead(
      LotesMapper.toRows(lotes),
      'Filtrado de lotes completado',
    );
  }

  async filtrarLotes(queryParams: FilterLoteDTO) {
    return this.filtrar(queryParams);
  }

  /**
   * COMBOS
   */
  async listarComboProductos() {
    const productos = await this.dataSource.transaction((manager) =>
      this.lotesRepository.listarProductos(manager),
    );

    return ComboMapper.fromEntities(
      productos,
      (producto) => producto.nombreProd,
      (producto) => producto.ideProd,
    );
  }

  async listarComboEstados() {
    return ComboMapper.fromValues([
      'correcto',
      'proximo',
      'caducado',
      'devuelto',
    ]);
  }
}
