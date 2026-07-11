export enum EnumEstadosProducto {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo',
}

export type DisponibleProducto = 'si' | 'no';

export interface IProducto {
  ideProd: number;
  ideCate: number;
  ideMarc: number;
  codigoBarraProd: string;
  nombreProd: string;
  precioVentaProd: number;
  ivaProd: number;
  dctoPromoProd: number;
  stockProd: number;
  stockMinimoProd: number;
  disponibleProd: DisponibleProducto;
  estadoProd: EnumEstadosProducto;
  descripcionProd: string | null;
  urlImgProd: string | null;
}

export class CProducto implements IProducto {
  constructor(
    private _ideProd: number,
    private _ideCate: number,
    private _ideMarc: number,
    private _codigoBarraProd: string,
    private _nombreProd: string,
    private _precioVentaProd: number,
    private _ivaProd: number,
    private _dctoPromoProd: number,
    private _stockProd: number,
    private _stockMinimoProd: number,
    private _disponibleProd: DisponibleProducto,
    private _estadoProd: EnumEstadosProducto,
    private _descripcionProd: string | null,
    private _urlImgProd: string | null,
  ) {}

  get ideProd() {
    return this._ideProd;
  }
  set ideProd(value: number) {
    this._ideProd = value;
  }

  get ideCate() {
    return this._ideCate;
  }
  set ideCate(value: number) {
    this._ideCate = value;
  }

  get ideMarc() {
    return this._ideMarc;
  }
  set ideMarc(value: number) {
    this._ideMarc = value;
  }

  get codigoBarraProd() {
    return this._codigoBarraProd;
  }
  set codigoBarraProd(value: string) {
    this._codigoBarraProd = value;
  }

  get nombreProd() {
    return this._nombreProd;
  }
  set nombreProd(value: string) {
    this._nombreProd = value;
  }

  get precioVentaProd() {
    return this._precioVentaProd;
  }
  set precioVentaProd(value: number) {
    this._precioVentaProd = value;
  }

  get ivaProd() {
    return this._ivaProd;
  }
  set ivaProd(value: number) {
    this._ivaProd = value;
  }

  get dctoPromoProd() {
    return this._dctoPromoProd;
  }
  set dctoPromoProd(value: number) {
    this._dctoPromoProd = value;
  }

  get stockProd() {
    return this._stockProd;
  }
  set stockProd(value: number) {
    this._stockProd = value;
  }

  get stockMinimoProd() {
    return this._stockMinimoProd;
  }
  set stockMinimoProd(value: number) {
    this._stockMinimoProd = value;
  }

  get disponibleProd() {
    return this._disponibleProd;
  }
  set disponibleProd(value: DisponibleProducto) {
    this._disponibleProd = value;
  }

  get estadoProd() {
    return this._estadoProd;
  }
  set estadoProd(value: EnumEstadosProducto) {
    this._estadoProd = value;
  }

  get descripcionProd() {
    return this._descripcionProd;
  }
  set descripcionProd(value: string | null) {
    this._descripcionProd = value;
  }

  get urlImgProd() {
    return this._urlImgProd;
  }
  set urlImgProd(value: string | null) {
    this._urlImgProd = value;
  }
}

export interface IProductoResult {
  ide_prod: number;
  ide_cate: number;
  ide_marc: number;
  codigo_barra_prod: string;
  nombre_prod: string;
  precio_venta_prod: number;
  iva_prod: number;
  dcto_promo_prod: number;
  stock_prod: number;
  stock_minimo_prod: number;
  disponible_prod: DisponibleProducto;
  estado_prod: EnumEstadosProducto;
  descripcion_prod: string | null;
  url_img_prod: string | null;
}

export interface IFiltroProducto {
  ideProd?: number;
  ideCate?: number;
  ideMarc?: number;
  codigoBarraProd?: string;
  nombreProd?: string;
  disponibleProd?: DisponibleProducto;
  estadoProd?: EnumEstadosProducto;
}
