import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ApiResponseFactory, ComboMapper, IdUtil } from '@common/index';
import { DataSource } from 'typeorm';
import { CreateProveedorDTO } from './dto/create_proveedor.dto';
import { FilterProveedorDTO } from './dto/filter_proveedor.dto';
import { UpdateProveedorDTO } from './dto/update_proveedor.dto';
import { ProveedoresMapper } from './proveedores.mapper';
import { ProveedoresRepository } from './proveedores.repository';

@Injectable()
export class ProveedoresService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly proveedoresRepository: ProveedoresRepository,
  ) {}

  async listar() {
    const proveedores = await this.dataSource.transaction((manager) =>
      this.proveedoresRepository.listar(manager),
    );

    return ApiResponseFactory.legacyRead(
      ProveedoresMapper.toRows(proveedores),
      'Listado de proveedores obtenido',
    );
  }

  async buscar(id: number) {
    const ideProv = IdUtil.requireId(id, 'El ID del proveedor no es válido.');

    const proveedor = await this.dataSource.transaction((manager) =>
      this.proveedoresRepository.buscarPorId(ideProv, manager),
    );

    return ApiResponseFactory.legacyRead(
      proveedor ? [ProveedoresMapper.toRow(proveedor)] : [],
      'Proveedor encontrado',
    );
  }

  async filtrar(queryParams: FilterProveedorDTO) {
    const proveedores = await this.dataSource.transaction((manager) =>
      this.proveedoresRepository.filtrar(queryParams, manager),
    );

    return ApiResponseFactory.legacyRead(
      ProveedoresMapper.toRows(proveedores),
      'Filtrado de proveedores completado',
    );
  }

  async insertar(body: CreateProveedorDTO) {
    try {
      const proveedor = await this.dataSource.transaction((manager) =>
        this.proveedoresRepository.crear(body, manager),
      );

      return ApiResponseFactory.legacyWrite(
        1,
        'Proveedor registrado correctamente',
        proveedor.ideProv,
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo registrar el proveedor.',
      );
    }
  }

  async actualizar(body: UpdateProveedorDTO) {
    const ideProv = IdUtil.requireId(
      body.ideProv,
      'El ID del proveedor no es válido.',
    );

    try {
      const proveedor = await this.dataSource.transaction(async (manager) => {
        const proveedorActual = await this.proveedoresRepository.buscarPorId(
          ideProv,
          manager,
        );

        if (!proveedorActual) {
          throw new Error('No se encontró el proveedor indicado.');
        }

        return this.proveedoresRepository.actualizar(
          proveedorActual,
          body,
          manager,
        );
      });

      return ApiResponseFactory.legacyWrite(
        1,
        'Proveedor actualizado correctamente',
        proveedor.ideProv,
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo actualizar el proveedor.',
      );
    }
  }

  async eliminar(id: number) {
    const ideProv = IdUtil.requireId(id, 'El ID del proveedor no es válido.');

    try {
      const affected = await this.dataSource.transaction((manager) =>
        this.proveedoresRepository.eliminar(ideProv, manager),
      );

      if (affected === 0) {
        return ApiResponseFactory.legacyWrite(
          0,
          'No se encontró el proveedor indicado.',
        );
      }

      return ApiResponseFactory.legacyWrite(
        1,
        'Proveedor eliminado correctamente',
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo eliminar el proveedor.',
      );
    }
  }

  /**
   * JOINS
   */
  async listarProveedores() {
    const proveedores = await this.dataSource.transaction((manager) =>
      this.proveedoresRepository.listar(manager),
    );

    return ApiResponseFactory.legacyRead(
      ProveedoresMapper.toEmpresaRows(proveedores),
      'Listado de proveedores obtenido',
    );
  }

  async filtrarProveedores(queryParams: FilterProveedorDTO) {
    const proveedores = await this.dataSource.transaction((manager) =>
      this.proveedoresRepository.filtrar(queryParams, manager),
    );

    return ApiResponseFactory.legacyRead(
      ProveedoresMapper.toEmpresaRows(proveedores),
      'Filtrado de proveedores completado',
    );
  }

  async buscarProveedor(id: number) {
    const ideProv = IdUtil.requireId(id, 'El ID del proveedor no es válido.');

    const proveedor = await this.dataSource.transaction((manager) =>
      this.proveedoresRepository.buscarPorId(ideProv, manager),
    );

    return ApiResponseFactory.legacyRead(
      proveedor ? [ProveedoresMapper.toEmpresaRow(proveedor)] : [],
      'Proveedor encontrado',
    );
  }

  /**
   * COMBOS
   */
  async listarComboProveedores() {
    const proveedores = await this.dataSource.transaction((manager) =>
      this.proveedoresRepository.listar(manager),
    );

    return ComboMapper.fromEntities(
      proveedores,
      (proveedor) => ProveedoresMapper.getNombreCompleto(proveedor),
      (proveedor) => proveedor.ideProv,
    );
  }

  async listarComboProveedorCedula() {
    const proveedores = await this.dataSource.transaction((manager) =>
      this.proveedoresRepository.listar(manager),
    );

    return ComboMapper.fromEntities(
      proveedores,
      (proveedor) => proveedor.cedulaProv,
      (proveedor) => proveedor.ideProv,
    );
  }

  async listarComboProveedorPrimerNombre() {
    const proveedores = await this.dataSource.transaction((manager) =>
      this.proveedoresRepository.listar(manager),
    );

    return ComboMapper.fromEntities(
      proveedores,
      (proveedor) => proveedor.primerNombreProv,
      (proveedor) => proveedor.ideProv,
    );
  }

  async listarComboProveedorApellidoPaterno() {
    const proveedores = await this.dataSource.transaction((manager) =>
      this.proveedoresRepository.listar(manager),
    );

    return ComboMapper.fromEntities(
      proveedores,
      (proveedor) => proveedor.apellidoPaternoProv,
      (proveedor) => proveedor.ideProv,
    );
  }

  async listarComboProveedorEmail() {
    const proveedores = await this.dataSource.transaction((manager) =>
      this.proveedoresRepository.listar(manager),
    );

    return ComboMapper.fromEntities(
      proveedores,
      (proveedor) => proveedor.emailProv,
      (proveedor) => proveedor.ideProv,
    );
  }
}
