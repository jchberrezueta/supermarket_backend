import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ApiResponseFactory, ComboMapper } from '@common/index';
import { DataSource } from 'typeorm';
import { CreateEmpresaDTO } from './dto/create_empresa.dto';
import { CreateEmpresaPrecioDTO } from './dto/create_precio.dto';
import { FilterEmpresaDTO } from './dto/filter_empresa.dto';
import { UpdateEmpresaDTO } from './dto/update_empresa.dto';
import { UpdateEmpresaPrecioDTO } from './dto/update_precio.dto';
import { EmpresasMapper } from './empresas.mapper';
import { EmpresasRepository } from './empresas.repository';

@Injectable()
export class EmpresasService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly empresasRepository: EmpresasRepository,
  ) {}

  async listar() {
    const empresas = await this.dataSource.transaction((manager) =>
      this.empresasRepository.listar(manager),
    );

    return ApiResponseFactory.legacyRead(
      EmpresasMapper.toRows(empresas),
      'Listado de empresas obtenido',
    );
  }

  async buscar(id: number) {
    const ideEmpr = Number(id);

    if (!ideEmpr || Number.isNaN(ideEmpr)) {
      throw new BadRequestException('El ID de la empresa no es válido.');
    }

    const empresa = await this.dataSource.transaction((manager) =>
      this.empresasRepository.buscarPorId(ideEmpr, manager),
    );

    return ApiResponseFactory.legacyRead(
      empresa ? [EmpresasMapper.toRow(empresa)] : [],
      'Empresa encontrada',
    );
  }

  async filtrar(queryParams: FilterEmpresaDTO) {
    const empresas = await this.dataSource.transaction((manager) =>
      this.empresasRepository.filtrar(queryParams, manager),
    );

    return ApiResponseFactory.legacyRead(
      EmpresasMapper.toRows(empresas),
      'Filtrado de empresas completado',
    );
  }

  async insertar(body: CreateEmpresaDTO) {
    try {
      const empresa = await this.dataSource.transaction((manager) =>
        this.empresasRepository.crear(body, manager),
      );

      return ApiResponseFactory.legacyWrite(
        1,
        'Empresa registrada correctamente',
        empresa.ideEmpr,
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo registrar la empresa.',
      );
    }
  }

  async actualizar(body: UpdateEmpresaDTO) {
    const ideEmpr = Number(body.ideEmp);

    if (!ideEmpr || Number.isNaN(ideEmpr)) {
      throw new BadRequestException('El ID de la empresa no es válido.');
    }

    try {
      const empresa = await this.dataSource.transaction(async (manager) => {
        const empresaActual = await this.empresasRepository.buscarPorId(
          ideEmpr,
          manager,
        );

        if (!empresaActual) {
          throw new NotFoundException('No se encontró la empresa indicada.');
        }

        return this.empresasRepository.actualizar(empresaActual, body, manager);
      });

      return ApiResponseFactory.legacyWrite(
        1,
        'Empresa actualizada correctamente',
        empresa.ideEmpr,
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo actualizar la empresa.',
      );
    }
  }

  async eliminar(id: number) {
    const ideEmpr = Number(id);

    if (!ideEmpr || Number.isNaN(ideEmpr)) {
      throw new BadRequestException('El ID de la empresa no es válido.');
    }

    try {
      const affected = await this.dataSource.transaction((manager) =>
        this.empresasRepository.eliminar(ideEmpr, manager),
      );

      if (affected === 0) {
        return ApiResponseFactory.legacyWrite(
          0,
          'No se encontró la empresa indicada.',
        );
      }

      return ApiResponseFactory.legacyWrite(
        1,
        'Empresa eliminada correctamente',
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo eliminar la empresa.',
      );
    }
  }

  /**
   * COMBOS
   */
  async listarComboEmpresas() {
    const empresas = await this.dataSource.transaction((manager) =>
      this.empresasRepository.listarActivas(manager),
    );

    return ComboMapper.fromEntities(
      empresas,
      (empresa) => empresa.nombreEmpr,
      (empresa) => empresa.ideEmpr,
    );
  }

  async listarEstados() {
    return ComboMapper.fromValues(['activo', 'inactivo']);
  }

  /**
   * EMPRESA PRECIOS
   */
  async listarPrecios() {
    const precios = await this.dataSource.transaction((manager) =>
      this.empresasRepository.listarPrecios(manager),
    );

    return ApiResponseFactory.legacyRead(
      EmpresasMapper.toPrecioRows(precios),
      'Listado de precios de empresa obtenido',
    );
  }

  async listarPreciosProductosEmpresa(id: number) {
    const ideEmpr = Number(id);

    if (!ideEmpr || Number.isNaN(ideEmpr)) {
      throw new BadRequestException('El ID de la empresa no es válido.');
    }

    const precios = await this.dataSource.transaction((manager) =>
      this.empresasRepository.listarPreciosPorEmpresa(ideEmpr, manager),
    );

    return ApiResponseFactory.legacyRead(
      EmpresasMapper.toPrecioRows(precios),
      'Listado de precios por empresa obtenido',
    );
  }

  async insertarPrecio(body: CreateEmpresaPrecioDTO) {
    try {
      const precio = await this.dataSource.transaction((manager) =>
        this.empresasRepository.crearPrecio(body, manager),
      );

      return ApiResponseFactory.legacyWrite(
        1,
        'Precio de empresa registrado correctamente',
        precio.ideEmprProd,
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo registrar el precio de empresa.',
      );
    }
  }

  async actualizarPrecio(body: UpdateEmpresaPrecioDTO) {
    const ideEmprProd = Number(body.ideEmprProd);

    if (!ideEmprProd || Number.isNaN(ideEmprProd)) {
      throw new BadRequestException(
        'El ID del precio de empresa no es válido.',
      );
    }

    try {
      const precio = await this.dataSource.transaction(async (manager) => {
        const precioActual = await this.empresasRepository.buscarPrecioPorId(
          ideEmprProd,
          manager,
        );

        if (!precioActual) {
          throw new NotFoundException(
            'No se encontró el precio de empresa indicado.',
          );
        }

        return this.empresasRepository.actualizarPrecio(
          precioActual,
          body,
          manager,
        );
      });

      return ApiResponseFactory.legacyWrite(
        1,
        'Precio de empresa actualizado correctamente',
        precio.ideEmprProd,
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo actualizar el precio de empresa.',
      );
    }
  }
}
