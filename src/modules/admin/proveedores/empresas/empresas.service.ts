import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ApiResponseFactory, ComboMapper, IdUtil } from '@common/index';
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
    const ideEmpr = IdUtil.requireId(id, 'El ID de la empresa no es válido.');

    const empresa = await this.dataSource.transaction((manager) =>
      this.empresasRepository.buscarPorId(ideEmpr, manager),
    );

    return ApiResponseFactory.legacyRead(
      empresa ? [EmpresasMapper.toRow(empresa)] : [],
      'Empresa encontrada',
    );
  }

  async buscarActiva(id: number) {
    const ideEmpr = IdUtil.requireId(id, 'El ID de la empresa no es válido.');

    const empresa = await this.dataSource.transaction((manager) =>
      this.empresasRepository.buscarPorIdActiva(ideEmpr, manager),
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
    const ideEmpr = IdUtil.requireId(
      body.ideEmp,
      'El ID de la empresa no es válido.',
    );

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
    const ideEmpr = IdUtil.requireId(id, 'El ID de la empresa no es válido.');

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
      this.empresasRepository.listar(manager),
    );

    return ComboMapper.fromEntities(
      empresas,
      (empresa) => empresa.nombreEmpr,
      (empresa) => empresa.ideEmpr,
    );
  }

  async listarComboEmpresasActivas() {
    const empresas = await this.dataSource.transaction((manager) =>
      this.empresasRepository.listarActivas(manager),
    );

    return ComboMapper.fromEntities(
      empresas,
      (empresa) => empresa.nombreEmpr,
      (empresa) => empresa.ideEmpr,
    );
  }

  async listarComboResponsable() {
    const empresas = await this.dataSource.transaction((manager) =>
      this.empresasRepository.listarActivas(manager),
    );

    return ComboMapper.fromEntities(
      empresas,
      (empresa) => empresa.responsableEmpr,
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

  async listarPreciosEstados() {
    return ComboMapper.fromValues(['activo', 'inactivo']);
  }

  async listarPreciosProductosEmpresa(id: number) {
    const ideEmpr = IdUtil.requireId(id, 'El ID de la empresa no es válido.');

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
      const precio = await this.dataSource.transaction(async (manager) => {
        this.validarValoresPrecio(body);

        const empresa = await this.empresasRepository.buscarPorId(
          body.ideEmpr,
          manager,
        );

        if (!empresa) {
          throw new NotFoundException('No se encontró la empresa indicada.');
        }

        if (empresa.estadoEmpr !== 'activo') {
          throw new BadRequestException(
            'No se puede registrar un precio para una empresa inactiva.',
          );
        }

        const producto = await this.empresasRepository.buscarProductoPorId(
          body.ideProd,
          manager,
        );

        if (!producto) {
          throw new NotFoundException('No se encontró el producto indicado.');
        }

        if (producto.estadoProd !== 'activo') {
          throw new BadRequestException(
            'No se puede registrar un precio para un producto inactivo.',
          );
        }

        const precioExistente =
          await this.empresasRepository.buscarPrecioPorEmpresaProducto(
            body.ideEmpr,
            body.ideProd,
            manager,
          );

        if (precioExistente) {
          throw new BadRequestException(
            'La empresa ya tiene un precio configurado para este producto. Edite el registro existente.',
          );
        }

        return this.empresasRepository.crearPrecio(body, manager);
      });

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
    const ideEmprProd = IdUtil.requireId(
      body.ideEmprProd,
      'El ID del precio de empresa no es válido.',
    );

    try {
      const precio = await this.dataSource.transaction(async (manager) => {
        this.validarValoresPrecio(body);

        const precioActual = await this.empresasRepository.buscarPrecioPorId(
          ideEmprProd,
          manager,
        );

        if (!precioActual) {
          throw new NotFoundException(
            'No se encontró el precio de empresa indicado.',
          );
        }

        if (
          precioActual.ideEmpr !== body.ideEmpr ||
          precioActual.ideProd !== body.ideProd
        ) {
          throw new BadRequestException(
            'La empresa y el producto no pueden modificarse. Cree otro registro o reactive el existente.',
          );
        }

        /*
         * Para mantener el precio activo,
         * la empresa y el producto también
         * deben estar activos.
         */
        if (body.estadoEmprProd === 'activo') {
          const empresa = await this.empresasRepository.buscarPorId(
            body.ideEmpr,
            manager,
          );

          if (!empresa || empresa.estadoEmpr !== 'activo') {
            throw new BadRequestException(
              'No se puede activar un precio perteneciente a una empresa inactiva.',
            );
          }

          const producto = await this.empresasRepository.buscarProductoPorId(
            body.ideProd,
            manager,
          );

          if (!producto || producto.estadoProd !== 'activo') {
            throw new BadRequestException(
              'No se puede activar un precio perteneciente a un producto inactivo.',
            );
          }
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

  private validarValoresPrecio(
    body: CreateEmpresaPrecioDTO | UpdateEmpresaPrecioDTO,
  ): void {
    const precio = Number(body.precioCompraProd);

    const descuentoCompra = Number(body.dctoCompraProd);

    const descuentoCaducidad = Number(body.dctoCaducidadProd);

    const iva = Number(body.ivaProd);

    if (!Number.isFinite(precio) || precio <= 0) {
      throw new BadRequestException(
        'El precio de compra debe ser mayor que cero.',
      );
    }

    if (descuentoCompra > precio) {
      throw new BadRequestException(
        'El descuento de compra unitario no puede superar el precio de compra.',
      );
    }

    if (descuentoCaducidad > precio) {
      throw new BadRequestException(
        'El descuento por caducidad unitario no puede superar el precio de compra.',
      );
    }

    if (descuentoCompra + descuentoCaducidad > precio) {
      throw new BadRequestException(
        'La suma de los descuentos unitarios no puede superar el precio de compra.',
      );
    }

    if (iva < 0 || iva > 100) {
      throw new BadRequestException('El IVA debe estar entre 0 y 100.');
    }
  }
}
