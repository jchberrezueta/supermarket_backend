import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ApiResponseFactory, IdUtil } from '@common/index';
import { LoteEntity, ProductoEntity } from '@entities';
import { DataSource, EntityManager } from 'typeorm';

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
   * Lista el catálogo público usando como stock disponible la suma de los
   * lotes vigentes y no devueltos. Así la tienda no ofrece unidades que el
   * motor FEFO no podría vender.
   */
  async listar() {
    const filas = await this.dataSource.transaction(async (manager) => {
      const productos = await manager.getRepository(ProductoEntity).find({
        where: {
          estadoProd: 'activo',
        },
        relations: {
          categoria: true,
          marca: true,
        },
        order: {
          nombreProd: 'ASC',
        },
      });

      return this.mapearProductosConStockVendible(productos, manager);
    });

    return ApiResponseFactory.legacyRead(
      filas,
      'Listado de productos obtenido',
    );
  }

  async buscar(id: number) {
    const ideProd = IdUtil.requireId(id, 'El ID del producto no es válido.');

    const filas = await this.dataSource.transaction(async (manager) => {
      const producto = await manager.getRepository(ProductoEntity).findOne({
        where: {
          ideProd,
          estadoProd: 'activo',
        },
        relations: {
          categoria: true,
          marca: true,
        },
      });

      if (!producto) {
        return [];
      }

      return this.mapearProductosConStockVendible([producto], manager);
    });

    return ApiResponseFactory.legacyRead(filas, 'Producto encontrado');
  }

  async filtrar(filtros: MobileProductoFiltros) {
    const filas = await this.dataSource.transaction(async (manager) => {
      const qb = manager
        .getRepository(ProductoEntity)
        .createQueryBuilder('producto')
        .leftJoinAndSelect('producto.categoria', 'categoria')
        .leftJoinAndSelect('producto.marca', 'marca')
        .andWhere('producto.estadoProd = :estadoProd', {
          estadoProd: filtros.estadoProd ?? 'activo',
        })
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

      const productos = await qb.getMany();
      const productosConStock = await this.mapearProductosConStockVendible(
        productos,
        manager,
      );

      if (filtros.disponibleProd === 'si') {
        return productosConStock.filter(
          (producto) => producto.disponible_prod === 'si',
        );
      }

      if (filtros.disponibleProd === 'no') {
        return productosConStock.filter(
          (producto) => producto.disponible_prod === 'no',
        );
      }

      return productosConStock;
    });

    return ApiResponseFactory.legacyRead(
      filas,
      'Filtrado de productos completado',
    );
  }

  private async mapearProductosConStockVendible(
    productos: ProductoEntity[],
    manager: EntityManager,
  ) {
    const stockPorProducto = await this.obtenerStockVendiblePorProducto(
      productos.map((producto) => producto.ideProd),
      manager,
    );

    return productos.map((producto) =>
      this.toMobileProductoRow(
        producto,
        stockPorProducto.get(producto.ideProd) ?? 0,
      ),
    );
  }

  private async obtenerStockVendiblePorProducto(
    idsProductos: number[],
    manager: EntityManager,
  ): Promise<Map<number, number>> {
    if (!idsProductos.length) {
      return new Map<number, number>();
    }

    const rows = await manager
      .getRepository(LoteEntity)
      .createQueryBuilder('lote')
      .select('lote.ideProd', 'ideProd')
      .addSelect('COALESCE(SUM(lote.stockLote), 0)', 'stockVendible')
      .where('lote.ideProd IN (:...idsProductos)', {
        idsProductos,
      })
      .andWhere('lote.stockLote > 0')
      .andWhere('DATE(lote.fechaCaducidadLote) >= CURRENT_DATE')
      .andWhere('lote.estadoLote <> :estadoDevuelto', {
        estadoDevuelto: 'devuelto',
      })
      .groupBy('lote.ideProd')
      .getRawMany<{
        ideProd: string | number;
        stockVendible: string | number;
      }>();

    return new Map(
      rows.map((row) => [Number(row.ideProd), Number(row.stockVendible)]),
    );
  }

  private toMobileProductoRow(
    producto: ProductoEntity,
    stockVendible: number,
  ) {
    const precioVenta = Number(producto.precioVentaProd ?? 0);
    const iva = Number(producto.ivaProd ?? 0);
    const descuento = Number(producto.dctoPromoProd ?? 0);
    const stock = Math.max(0, Math.trunc(Number(stockVendible) || 0));
    const disponible = stock > 0 ? 'si' : 'no';

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
      stock_prod: stock,
      disponible_prod: disponible,
      estado_prod: producto.estadoProd,
      descripcion_prod: producto.descripcionProd,
      url_img_prod: producto.urlImgProd,
      usua_ingre: producto.usuaIngre,
      fecha_ingre: producto.fechaIngre,
      usua_actua: producto.usuaActua,
      fecha_actua: producto.fechaActua,

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
      stockProd: stock,
      disponibleProd: disponible,
      estadoProd: producto.estadoProd,
      descripcionProd: producto.descripcionProd,
      urlImgProd: producto.urlImgProd,
    };
  }
}
