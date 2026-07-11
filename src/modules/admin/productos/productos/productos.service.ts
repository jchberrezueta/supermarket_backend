import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ApiResponseFactory, ComboMapper, IdUtil } from '@common/index';
import { DataSource } from 'typeorm';
import { CreateProductoDTO } from './dto/create_producto.dto';
import { FilterProductoDTO } from './dto/filter_producto.dto';
import { UpdateProductoDTO } from './dto/update_producto.dto';
import { ProductosMapper } from './productos.mapper';
import { ProductosRepository } from './productos.repository';

@Injectable()
export class ProductosService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly productosRepository: ProductosRepository,
  ) {}

  async listar() {
    const productos = await this.dataSource.transaction((manager) =>
      this.productosRepository.listar(manager),
    );

    return ApiResponseFactory.legacyRead(
      ProductosMapper.toRows(productos),
      'Listado de productos obtenido',
    );
  }

  async buscar(id: number) {
    const ideProd = IdUtil.requireId(id, 'El ID del producto no es válido.');

    const producto = await this.dataSource.transaction((manager) =>
      this.productosRepository.buscarPorId(ideProd, manager),
    );

    if (!producto) {
      throw new NotFoundException('No se encontró el producto indicado.');
    }

    return ApiResponseFactory.legacyRead(
      [ProductosMapper.toRow(producto)],
      'Producto encontrado',
    );
  }

  async filtrar(queryParams: FilterProductoDTO) {
    const productos = await this.dataSource.transaction((manager) =>
      this.productosRepository.filtrar(queryParams, manager),
    );

    return ApiResponseFactory.legacyRead(
      ProductosMapper.toRows(productos),
      'Filtrado de productos completado',
    );
  }

  async insertar(body: CreateProductoDTO) {
    try {
      const producto = await this.dataSource.transaction((manager) =>
        this.productosRepository.crear(body, manager),
      );

      return ApiResponseFactory.legacyWrite(
        1,
        'Producto registrado correctamente',
        producto.ideProd,
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo registrar el producto.',
      );
    }
  }

  async actualizar(body: UpdateProductoDTO) {
    const ideProd = IdUtil.requireId(
      body.ideProd,
      'El ID del producto no es válido.',
    );

    try {
      const producto = await this.dataSource.transaction(async (manager) => {
        const productoActual = await this.productosRepository.buscarPorId(
          ideProd,
          manager,
        );

        if (!productoActual) {
          throw new NotFoundException('No se encontró el producto indicado.');
        }

        return this.productosRepository.actualizar(
          productoActual,
          body,
          manager,
        );
      });

      return ApiResponseFactory.legacyWrite(
        1,
        'Producto actualizado correctamente',
        producto.ideProd,
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo actualizar el producto.',
      );
    }
  }

  async eliminar(id: number) {
    const ideProd = IdUtil.requireId(id, 'El ID del producto no es válido.');

    try {
      const producto = await this.dataSource.transaction(async (manager) => {
        const productoActual =
          await this.productosRepository.buscarPorIdForUpdate(ideProd, manager);

        if (!productoActual) {
          throw new NotFoundException('No se encontró el producto indicado.');
        }

        return this.productosRepository.desactivar(productoActual, manager);
      });

      return ApiResponseFactory.legacyWrite(
        1,
        'Producto desactivado correctamente. El historial y el inventario se conservaron.',
        producto.ideProd,
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo desactivar el producto.',
      );
    }
  }

  /**
   * JOINS
   *
   * Se mantienen estos métodos porque Angular ya usa estas rutas:
   * - productos/listar/productos
   * - productos/filtrar/productos
   *
   * Internamente ya no dependen de funciones PostgreSQL.
   */
  async listarProductos() {
    return this.listar();
  }

  async filtrarProductos(queryParams: FilterProductoDTO) {
    return this.filtrar(queryParams);
  }

  /**
   * COMBOS
   */
  async listarComboProductos() {
    const productos = await this.dataSource.transaction((manager) =>
      this.productosRepository.listar(manager),
    );

    return ComboMapper.fromEntities(
      productos,
      (producto) => producto.nombreProd,
      (producto) => producto.ideProd,
    );
  }

  async listarComboCodigosBarras() {
    const productos = await this.dataSource.transaction((manager) =>
      this.productosRepository.listar(manager),
    );

    const codigosUnicos = Array.from(
      new Set(
        productos
          .map((producto) => producto.codigoBarraProd)
          .filter((codigo) => !!codigo),
      ),
    ).sort((a, b) => a.localeCompare(b));

    return ComboMapper.fromEntities(
      codigosUnicos,
      (codigo) => codigo,
      (codigo) => codigo,
    );
  }

  async listarComboEstados() {
    return ComboMapper.fromValues(['activo', 'inactivo']);
  }

  async listarComboDisponibilidad() {
    return ComboMapper.fromValues(['si', 'no']);
  }

  async buscarActivoPorCodigo(codigo: string) {
    const producto = await this.dataSource.transaction((manager) =>
      this.productosRepository.findActivoByCodigo(codigo, manager),
    );

    if (!producto) {
      throw new NotFoundException(
        'No se encontró un producto activo con ese código.',
      );
    }

    return ApiResponseFactory.success(
      producto,
      'Producto encontrado correctamente.',
    );
  }
}
