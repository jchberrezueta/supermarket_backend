import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ApiResponseFactory, ComboMapper } from '@common/index';
import { DataSource } from 'typeorm';
import { CreateMarcaDTO } from './dto/create_marca.dto';
import { FilterMarcaDTO } from './dto/filter_marca.dto';
import { UpdateMarcaDTO } from './dto/update_marca.dto';
import { MarcasMapper } from './marcas.mapper';
import { MarcasRepository } from './marcas.repository';

@Injectable()
export class MarcasService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly marcasRepository: MarcasRepository,
  ) {}

  async listar() {
    const marcas = await this.dataSource.transaction((manager) =>
      this.marcasRepository.listar(manager),
    );

    return ApiResponseFactory.legacyRead(
      MarcasMapper.toRows(marcas),
      'Listado de marcas obtenido',
    );
  }

  async buscar(id: number) {
    const ideMarc = Number(id);

    if (!ideMarc || Number.isNaN(ideMarc)) {
      throw new BadRequestException('El ID de la marca no es válido.');
    }

    const marca = await this.dataSource.transaction((manager) =>
      this.marcasRepository.buscarPorId(ideMarc, manager),
    );

    return ApiResponseFactory.legacyRead(
      marca ? [MarcasMapper.toRow(marca)] : [],
      'Marca encontrada',
    );
  }

  async filtrar(queryParams: FilterMarcaDTO) {
    const marcas = await this.dataSource.transaction((manager) =>
      this.marcasRepository.filtrar(queryParams, manager),
    );

    return ApiResponseFactory.legacyRead(
      MarcasMapper.toRows(marcas),
      'Filtrado de marcas completado',
    );
  }

  async insertar(body: CreateMarcaDTO) {
    try {
      const marca = await this.dataSource.transaction((manager) =>
        this.marcasRepository.crear(body, manager),
      );

      return ApiResponseFactory.legacyWrite(
        1,
        'Marca registrada correctamente',
        marca.ideMarc,
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo registrar la marca.',
      );
    }
  }

  async actualizar(body: UpdateMarcaDTO) {
    const ideMarc = Number(body.ideMarc);

    if (!ideMarc || Number.isNaN(ideMarc)) {
      throw new BadRequestException('El ID de la marca no es válido.');
    }

    try {
      const marca = await this.dataSource.transaction(async (manager) => {
        const marcaActual = await this.marcasRepository.buscarPorId(
          ideMarc,
          manager,
        );

        if (!marcaActual) {
          throw new Error('No se encontró la marca indicada.');
        }

        return this.marcasRepository.actualizar(marcaActual, body, manager);
      });

      return ApiResponseFactory.legacyWrite(
        1,
        'Marca actualizada correctamente',
        marca.ideMarc,
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo actualizar la marca.',
      );
    }
  }

  async eliminar(id: number) {
    const ideMarc = Number(id);

    if (!ideMarc || Number.isNaN(ideMarc)) {
      throw new BadRequestException('El ID de la marca no es válido.');
    }

    try {
      const affected = await this.dataSource.transaction((manager) =>
        this.marcasRepository.eliminar(ideMarc, manager),
      );

      if (affected === 0) {
        return ApiResponseFactory.legacyWrite(
          0,
          'No se encontró la marca indicada.',
        );
      }

      return ApiResponseFactory.legacyWrite(1, 'Marca eliminada correctamente');
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message ||
          'No se pudo eliminar la marca. Puede estar relacionada con productos.',
      );
    }
  }

  /**
   * COMBOS
   */
  async listarComboNombre() {
    const marcas = await this.dataSource.transaction((manager) =>
      this.marcasRepository.listar(manager),
    );

    return ComboMapper.fromEntities(
      marcas,
      (marca) => marca.nombreMarc,
      (marca) => marca.ideMarc,
    );
  }

  async listarComboPais() {
    const marcas = await this.dataSource.transaction((manager) =>
      this.marcasRepository.listar(manager),
    );

    const paisesUnicos = Array.from(
      new Set(
        marcas.map((marca) => marca.paisOrigenMarc).filter((pais) => !!pais),
      ),
    ).sort((a, b) => a.localeCompare(b));

    return ComboMapper.fromEntities(
      paisesUnicos,
      (pais) => pais,
      (pais) => pais,
    );
  }

  async listarComboCalidad() {
    return ComboMapper.fromValues([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  }

  async listarComboMarcas() {
    return this.listarComboNombre();
  }
}
