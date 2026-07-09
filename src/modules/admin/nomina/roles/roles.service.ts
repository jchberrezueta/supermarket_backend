import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ApiResponseFactory, ComboMapper, IdUtil } from '@common/index';
import { DataSource } from 'typeorm';
import { CreateRolDTO } from './dto/create_rol.dto';
import { FilterRolDTO } from './dto/filter_rol.dto';
import { UpdateRolDTO } from './dto/update_rol.dto';
import { RolesMapper } from './roles.mapper';
import { RolesRepository } from './roles.repository';

@Injectable()
export class RolesService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly rolesRepository: RolesRepository,
  ) {}

  async listar() {
    const roles = await this.dataSource.transaction((manager) =>
      this.rolesRepository.listar(manager),
    );

    return ApiResponseFactory.legacyRead(
      RolesMapper.toRows(roles),
      'Listado de roles obtenido',
    );
  }

  async buscar(id: number) {
    const ideRol = IdUtil.requireId(id, 'El ID del rol no es válido.');

    const rol = await this.dataSource.transaction((manager) =>
      this.rolesRepository.buscarPorId(ideRol, manager),
    );

    return ApiResponseFactory.legacyRead(
      rol ? [RolesMapper.toRow(rol)] : [],
      'Rol encontrado',
    );
  }

  async filtrar(queryParams: FilterRolDTO) {
    const roles = await this.dataSource.transaction((manager) =>
      this.rolesRepository.filtrar(queryParams, manager),
    );

    return ApiResponseFactory.legacyRead(
      RolesMapper.toRows(roles),
      'Filtrado de roles completado',
    );
  }

  async insertar(body: CreateRolDTO) {
    try {
      const rol = await this.dataSource.transaction((manager) =>
        this.rolesRepository.crear(body, manager),
      );

      return ApiResponseFactory.legacyWrite(
        1,
        'Rol registrado correctamente',
        rol.ideRol,
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo registrar el rol.',
      );
    }
  }

  async actualizar(body: UpdateRolDTO) {
    const ideRol = IdUtil.requireId(body.ideRol, 'El ID del rol no es válido.');

    try {
      const rol = await this.dataSource.transaction(async (manager) => {
        const rolActual = await this.rolesRepository.buscarPorId(
          ideRol,
          manager,
        );

        if (!rolActual) {
          throw new Error('No se encontró el rol indicado.');
        }

        return this.rolesRepository.actualizar(rolActual, body, manager);
      });

      return ApiResponseFactory.legacyWrite(
        1,
        'Rol actualizado correctamente',
        rol.ideRol,
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo actualizar el rol.',
      );
    }
  }

  async eliminar(id: number) {
    const ideRol = IdUtil.requireId(id, 'El ID del rol no es válido.');

    try {
      const affected = await this.dataSource.transaction((manager) =>
        this.rolesRepository.eliminar(ideRol, manager),
      );

      if (affected === 0) {
        return ApiResponseFactory.legacyWrite(
          0,
          'No se encontró el rol indicado.',
        );
      }

      return ApiResponseFactory.legacyWrite(1, 'Rol eliminado correctamente');
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message ||
          'No se pudo eliminar el rol. Puede estar relacionado con empleados.',
      );
    }
  }

  /**
   * COMBOS
   */
  async listarComboRoles() {
    const roles = await this.dataSource.transaction((manager) =>
      this.rolesRepository.listar(manager),
    );

    return ComboMapper.fromEntities(
      roles,
      (rol) => rol.nombreRol,
      (rol) => rol.ideRol,
    );
  }

  async listarComboNombres() {
    return this.listarComboRoles();
  }

  async listarComboDescripciones() {
    const roles = await this.dataSource.transaction((manager) =>
      this.rolesRepository.listar(manager),
    );

    const descripcionesUnicas = Array.from(
      new Set(
        roles
          .map((rol) => rol.descripcionRol)
          .filter((descripcion) => !!descripcion),
      ),
    ).sort((a, b) => a.localeCompare(b));

    return ComboMapper.fromEntities(
      descripcionesUnicas,
      (descripcion) => descripcion,
      (descripcion) => descripcion,
    );
  }
}
