export interface IProducto {
  ide_prod: number;
  ide_cate: number;
  ide_marc: number;
  codigo_barra_prod: string;
  nombre_prod: string;
  precio_compra_prod: number;
  precio_venta_prod: number;
  iva_prod: number;
  dcto_promo_prod: number;
  dcto_caduc_prod: number;
  precio_final_prod: number;
  stock_prod: number;
  disponible_prod: 'si' | 'no';
  estado_prod: 'activo' | 'inactivo';
  descripcion_prod: string;

  usua_ingre?: string | null;
  fecha_ingre?: Date | null;
  usua_actua?: string | null;
  fecha_actua?: Date | null;
}
