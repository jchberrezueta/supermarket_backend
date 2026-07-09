import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ApiResponseFactory, ComboMapper, IdUtil } from '@common/index';
import { DataSource } from 'typeorm';
import { CreatePerfilDto } from './dto/create_perfil.dto';
import { FilterPerfilDto } from './dto/filter_perfil.dto';
import { UpdatePerfilDto } from './dto/update_perfil.dto';
import { PerfilesMapper } from './perfiles.mapper';
import { PerfilesRepository } from './perfiles.repository';

@Injectable()
export class PerfilesService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly perfilesRepository: PerfilesRepository,
  ) {}

  async listar() {
    const perfiles = await this.dataSource.transaction((manager) =>
      this.perfilesRepository.listar(manager),
    );

    return ApiResponseFactory.legacyRead(
      PerfilesMapper.toRows(perfiles),
      'Listado de perfiles obtenido',
    );
  }

  async buscar(id: number) {
    const idePerf = IdUtil.requireId(id, 'El ID del perfil no es válido.');

    const perfil = await this.dataSource.transaction((manager) =>
      this.perfilesRepository.buscarPorId(idePerf, manager),
    );

    return ApiResponseFactory.legacyRead(
      perfil ? [PerfilesMapper.toRow(perfil)] : [],
      'Perfil encontrado',
    );
  }

  async filtrar(queryParams: FilterPerfilDto) {
    const perfiles = await this.dataSource.transaction((manager) =>
      this.perfilesRepository.filtrar(queryParams, manager),
    );

    return ApiResponseFactory.legacyRead(
      PerfilesMapper.toRows(perfiles),
      'Filtrado de perfiles completado',
    );
  }

  async insertar(body: CreatePerfilDto) {
    try {
      const perfil = await this.dataSource.transaction((manager) =>
        this.perfilesRepository.crear(body, manager),
      );

      return ApiResponseFactory.legacyWrite(
        1,
        'Perfil registrado correctamente',
        perfil.idePerf,
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo registrar el perfil.',
      );
    }
  }

  async actualizar(body: UpdatePerfilDto) {
    const idePerf = IdUtil.requireId(
      body.idePerf,
      'El ID del perfil no es válido.',
    );

    try {
      const perfil = await this.dataSource.transaction(async (manager) => {
        const perfilActual = await this.perfilesRepository.buscarPorId(
          idePerf,
          manager,
        );

        if (!perfilActual) {
          throw new Error('No se encontró el perfil indicado.');
        }

        return this.perfilesRepository.actualizar(perfilActual, body, manager);
      });

      return ApiResponseFactory.legacyWrite(
        1,
        'Perfil actualizado correctamente',
        perfil.idePerf,
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo actualizar el perfil.',
      );
    }
  }

  async eliminar(id: number) {
    const idePerf = IdUtil.requireId(id, 'El ID del perfil no es válido.');

    try {
      const affected = await this.dataSource.transaction((manager) =>
        this.perfilesRepository.eliminar(idePerf, manager),
      );

      if (affected === 0) {
        return ApiResponseFactory.legacyWrite(
          0,
          'No se encontró el perfil indicado.',
        );
      }

      return ApiResponseFactory.legacyWrite(
        1,
        'Perfil eliminado correctamente',
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message ||
          'No se pudo eliminar el perfil. Puede estar relacionado con cuentas o accesos.',
      );
    }
  }

  /**
   * JOINS
   */
  async listarPerfiles() {
    return this.listar();
  }

  async filtrarPerfiles(queryParams: FilterPerfilDto) {
    return this.filtrar(queryParams);
  }

  /**
   * COMBOS
   */
  async listarComboPerfiles() {
    const perfiles = await this.dataSource.transaction((manager) =>
      this.perfilesRepository.listar(manager),
    );

    return ComboMapper.fromEntities(
      perfiles,
      (perfil) => perfil.nombrePerf,
      (perfil) => perfil.idePerf,
    );
  }

  async listarComboNombres() {
    return this.listarComboPerfiles();
  }

  async listarComboDescripcion() {
    const perfiles = await this.dataSource.transaction((manager) =>
      this.perfilesRepository.listar(manager),
    );

    const descripcionesUnicas = Array.from(
      new Set(
        perfiles
          .map((perfil) => perfil.descripcionPerf)
          .filter((descripcion) => !!descripcion),
      ),
    ).sort((a, b) => a.localeCompare(b));

    return ComboMapper.fromEntities(
      descripcionesUnicas,
      (descripcion) => descripcion,
      (descripcion) => descripcion,
    );
  }

  async listarComboRoles() {
    const roles = await this.dataSource.transaction((manager) =>
      this.perfilesRepository.listarRoles(manager),
    );

    return ComboMapper.fromEntities(
      roles,
      (rol) => rol.nombreRol,
      (rol) => rol.ideRol,
    );
  }
}
