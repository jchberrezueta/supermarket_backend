import { MoneyUtil } from '@common/utils/money.util';
import { ProductoEntity } from '@entities';

export interface ProductoRow {
  ide_prod: number;
  ide_cate: number;
  nombre_cate?: string;
  ide_marc: number;
  nombre_marc?: string;
  codigo_barra_prod: string;
  nombre_prod: string;
  precio_venta_prod: number;
  iva_prod: number;
  dcto_promo_prod: number;
  stock_prod: number;
  disponible_prod: string;
  estado_prod: string;
  descripcion_prod: string;
  url_img_prod: string;
}

export class ProductosMapper {
  static toRow(producto: ProductoEntity): ProductoRow {
    return {
      ide_prod: producto.ideProd,
      ide_cate: producto.ideCate,
      nombre_cate: producto.categoria?.nombreCate,
      ide_marc: producto.ideMarc,
      nombre_marc: producto.marca?.nombreMarc,
      codigo_barra_prod: producto.codigoBarraProd,
      nombre_prod: producto.nombreProd,
      precio_venta_prod: MoneyUtil.toNumber(producto.precioVentaProd),
      iva_prod: MoneyUtil.toNumber(producto.ivaProd),
      dcto_promo_prod: MoneyUtil.toNumber(producto.dctoPromoProd),
      stock_prod: producto.stockProd,
      disponible_prod: producto.disponibleProd,
      estado_prod: producto.estadoProd,
      descripcion_prod: producto.descripcionProd,
      url_img_prod: producto.urlImgProd,
    };
  }

  static toRows(productos: ProductoEntity[]): ProductoRow[] {
    return productos.map((producto) => this.toRow(producto));
  }
}
