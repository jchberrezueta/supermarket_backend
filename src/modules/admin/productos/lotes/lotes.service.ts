import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ApiResponseFactory, ComboMapper, IdUtil } from '@common/index';
import { DataSource } from 'typeorm';
import { CreateLoteDTO } from './dto/create_lote.dto';
import { FilterLoteDTO } from './dto/filter_lote.dto';
import { UpdateLoteDTO } from './dto/update_lote.dto';
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

  async insertar(body: CreateLoteDTO) {
    try {
      const lote = await this.dataSource.transaction((manager) =>
        this.lotesRepository.crear(body, manager),
      );

      return ApiResponseFactory.legacyWrite(
        1,
        'Lote registrado correctamente',
        lote.ideLote,
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo registrar el lote.',
      );
    }
  }

  async actualizar(body: UpdateLoteDTO) {
    const ideLote = IdUtil.requireId(
      body.ideLote,
      'El ID del lote no es válido.',
    );

    try {
      const lote = await this.dataSource.transaction(async (manager) => {
        const loteActual = await this.lotesRepository.buscarPorId(
          ideLote,
          manager,
        );

        if (!loteActual) {
          throw new Error('No se encontró el lote indicado.');
        }

        return this.lotesRepository.actualizar(loteActual, body, manager);
      });

      return ApiResponseFactory.legacyWrite(
        1,
        'Lote actualizado correctamente',
        lote.ideLote,
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo actualizar el lote.',
      );
    }
  }

  async eliminar(id: number) {
    const ideLote = IdUtil.requireId(id, 'El ID del lote no es válido.');

    try {
      const affected = await this.dataSource.transaction((manager) =>
        this.lotesRepository.eliminar(ideLote, manager),
      );

      if (affected === 0) {
        return ApiResponseFactory.legacyWrite(
          0,
          'No se encontró el lote indicado.',
        );
      }

      return ApiResponseFactory.legacyWrite(1, 'Lote eliminado correctamente');
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo eliminar el lote.',
      );
    }
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
