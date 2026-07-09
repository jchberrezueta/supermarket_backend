import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ApiResponseFactory, IdUtil } from '@common/index';
import { ProductoEntity } from '@entities';
import { DataSource } from 'typeorm';

interface MobileProductoFiltros {
  ideCate?: number;
  ideMarc?: number;
  nombreProd?: string;
  codigoBarraProd?: string;
  estadoProd?: string;
  disponibleProd?: string;
}

@Injectable()
export class MobileProductosService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Listar todos los productos disponibles para la tienda móvil.
   *
   * Antes dependía de:
   * - fn_listar_producto
   *
   * Ahora usa TypeORM y mantiene salida en snake_case
   * para no romper la app móvil.
   */
  async listar() {
    const productos = await this.dataSource.transaction((manager) =>
      manager.getRepository(ProductoEntity).find({
        relations: {
          categoria: true,
          marca: true,
        },
        order: {
          nombreProd: 'ASC',
        },
      }),
    );

    return ApiResponseFactory.legacyRead(
      productos.map((producto) => this.toMobileProductoRow(producto)),
      'Listado de productos obtenido',
    );
  }

  /**
   * Buscar un producto por ID.
   *
   * Se permite id = 0 si existe en la base.
   */
  async buscar(id: number) {
    const ideProd = IdUtil.requireId(id, 'El ID del producto no es válido.');

    const producto = await this.dataSource.transaction((manager) =>
      manager.getRepository(ProductoEntity).findOne({
        where: {
          ideProd,
        },
        relations: {
          categoria: true,
          marca: true,
        },
      }),
    );

    return ApiResponseFactory.legacyRead(
      producto ? [this.toMobileProductoRow(producto)] : [],
      'Producto encontrado',
    );
  }

  /**
   * Filtrar productos para la tienda móvil.
   *
   * Antes dependía de:
   * - fn_filtrar_producto
   *
   * Ahora usa QueryBuilder para evitar funciones PostgreSQL.
   */
  async filtrar(filtros: MobileProductoFiltros) {
    const productos = await this.dataSource.transaction(async (manager) => {
      const qb = manager
        .getRepository(ProductoEntity)
        .createQueryBuilder('producto')
        .leftJoinAndSelect('producto.categoria', 'categoria')
        .leftJoinAndSelect('producto.marca', 'marca')
        .orderBy('producto.nombreProd', 'ASC');

      if (filtros.ideCate !== undefined && filtros.ideCate !== null) {
        qb.andWhere('producto.ideCate = :ideCate', {
          ideCate: filtros.ideCate,
        });
      }

      if (filtros.ideMarc !== undefined && filtros.ideMarc !== null) {
        qb.andWhere('producto.ideMarc = :ideMarc', {
          ideMarc: filtros.ideMarc,
        });
      }

      if (filtros.nombreProd) {
        qb.andWhere('LOWER(producto.nombreProd) LIKE LOWER(:nombreProd)', {
          nombreProd: `%${filtros.nombreProd}%`,
        });
      }

      if (filtros.codigoBarraProd) {
        qb.andWhere('producto.codigoBarraProd = :codigoBarraProd', {
          codigoBarraProd: filtros.codigoBarraProd,
        });
      }

      if (filtros.estadoProd) {
        qb.andWhere('producto.estadoProd = :estadoProd', {
          estadoProd: filtros.estadoProd,
        });
      }

      if (filtros.disponibleProd) {
        qb.andWhere('producto.disponibleProd = :disponibleProd', {
          disponibleProd: filtros.disponibleProd,
        });
      }

      return qb.getMany();
    });

    return ApiResponseFactory.legacyRead(
      productos.map((producto) => this.toMobileProductoRow(producto)),
      'Filtrado de productos completado',
    );
  }

  private toMobileProductoRow(producto: ProductoEntity) {
    const precioVenta = Number(producto.precioVentaProd ?? 0);
    const iva = Number(producto.ivaProd ?? 0);
    const descuento = Number(producto.dctoPromoProd ?? 0);

    return {
      ide_prod: producto.ideProd,
      ide_cate: producto.ideCate,
      nombre_cate: producto.categoria?.nombreCate ?? null,
      ide_marc: producto.ideMarc,
      nombre_marc: producto.marca?.nombreMarc ?? null,
      codigo_barra_prod: producto.codigoBarraProd,
      nombre_prod: producto.nombreProd,
      precio_venta_prod: precioVenta,
      iva_prod: iva,
      dcto_promo_prod: descuento,
      stock_prod: producto.stockProd,
      disponible_prod: producto.disponibleProd,
      estado_prod: producto.estadoProd,
      descripcion_prod: producto.descripcionProd,
      url_img_prod: producto.urlImgProd,
      usua_ingre: producto.usuaIngre,
      fecha_ingre: producto.fechaIngre,
      usua_actua: producto.usuaActua,
      fecha_actua: producto.fechaActua,

      /**
       * También enviamos formato camelCase para que el frontend móvil
       * pueda usar cualquiera de los dos formatos sin romper.
       */
      ideProd: producto.ideProd,
      ideCate: producto.ideCate,
      nombreCate: producto.categoria?.nombreCate ?? null,
      ideMarc: producto.ideMarc,
      nombreMarc: producto.marca?.nombreMarc ?? null,
      codigoBarraProd: producto.codigoBarraProd,
      nombreProd: producto.nombreProd,
      precioVentaProd: precioVenta,
      ivaProd: iva,
      dctoPromoProd: descuento,
      stockProd: producto.stockProd,
      disponibleProd: producto.disponibleProd,
      estadoProd: producto.estadoProd,
      descripcionProd: producto.descripcionProd,
      urlImgProd: producto.urlImgProd,
    };
  }
}
