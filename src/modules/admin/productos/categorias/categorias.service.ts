import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ApiResponseFactory, ComboMapper } from '@common/index';
import { DataSource } from 'typeorm';
import { CategoriasMapper } from './categorias.mapper';
import { CategoriasRepository } from './categorias.repository';
import { CreateCategoriaDTO } from './dto/create_categoria.dto';
import { FilterCategoriaDTO } from './dto/filter_categoria.dto';
import { UpdateCategoriaDTO } from './dto/update_categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly categoriasRepository: CategoriasRepository,
  ) {}

  async listar() {
    const categorias = await this.dataSource.transaction((manager) =>
      this.categoriasRepository.listar(manager),
    );

    return ApiResponseFactory.legacyRead(
      CategoriasMapper.toRows(categorias),
      'Listado de categorías obtenido',
    );
  }

  async buscar(id: number) {
    const ideCate = Number(id);

    if (!ideCate || Number.isNaN(ideCate)) {
      throw new BadRequestException('El ID de la categoría no es válido.');
    }

    const categoria = await this.dataSource.transaction((manager) =>
      this.categoriasRepository.buscarPorId(ideCate, manager),
    );

    return ApiResponseFactory.legacyRead(
      categoria ? [CategoriasMapper.toRow(categoria)] : [],
      'Categoría encontrada',
    );
  }

  async filtrar(queryParams: FilterCategoriaDTO) {
    const categorias = await this.dataSource.transaction((manager) =>
      this.categoriasRepository.filtrar(queryParams, manager),
    );

    return ApiResponseFactory.legacyRead(
      CategoriasMapper.toRows(categorias),
      'Filtrado de categorías completado',
    );
  }

  async insertar(body: CreateCategoriaDTO) {
    try {
      const categoria = await this.dataSource.transaction((manager) =>
        this.categoriasRepository.crear(body, manager),
      );

      return ApiResponseFactory.legacyWrite(
        1,
        'Categoría registrada correctamente',
        categoria.ideCate,
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo registrar la categoría.',
      );
    }
  }

  async actualizar(body: UpdateCategoriaDTO) {
    const ideCate = Number(body.ideCate);

    if (!ideCate || Number.isNaN(ideCate)) {
      throw new BadRequestException('El ID de la categoría no es válido.');
    }

    try {
      const categoria = await this.dataSource.transaction(async (manager) => {
        const categoriaActual = await this.categoriasRepository.buscarPorId(
          ideCate,
          manager,
        );

        if (!categoriaActual) {
          throw new Error('No se encontró la categoría indicada.');
        }

        return this.categoriasRepository.actualizar(
          categoriaActual,
          body,
          manager,
        );
      });

      return ApiResponseFactory.legacyWrite(
        1,
        'Categoría actualizada correctamente',
        categoria.ideCate,
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo actualizar la categoría.',
      );
    }
  }

  async eliminar(id: number) {
    const ideCate = Number(id);

    if (!ideCate || Number.isNaN(ideCate)) {
      throw new BadRequestException('El ID de la categoría no es válido.');
    }

    try {
      const affected = await this.dataSource.transaction((manager) =>
        this.categoriasRepository.eliminar(ideCate, manager),
      );

      if (affected === 0) {
        return ApiResponseFactory.legacyWrite(
          0,
          'No se encontró la categoría indicada.',
        );
      }

      return ApiResponseFactory.legacyWrite(
        1,
        'Categoría eliminada correctamente',
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message ||
          'No se pudo eliminar la categoría. Puede estar relacionada con productos.',
      );
    }
  }

  /**
   * COMBOS
   */
  async listarComboCategoriaNombre() {
    const categorias = await this.dataSource.transaction((manager) =>
      this.categoriasRepository.listar(manager),
    );

    return ComboMapper.fromEntities(
      categorias,
      (categoria) => categoria.nombreCate,
      (categoria) => categoria.ideCate,
    );
  }

  async listarComboCategoriaDescripcion() {
    const categorias = await this.dataSource.transaction((manager) =>
      this.categoriasRepository.listar(manager),
    );

    return ComboMapper.fromEntities(
      categorias,
      (categoria) => categoria.descripcionCate,
      (categoria) => categoria.ideCate,
    );
  }

  async listarComboCategorias() {
    return this.listarComboCategoriaNombre();
  }
}
