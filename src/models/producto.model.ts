export interface IProducto {
    ideProd: number;
    ideCate: number;
    ideMarc: number;
    codigoBarraProd: string;
    nombreProd: string;
    precioCompraProd: number;
    precioVentaProd: number;
    ivaProd: number;
    dctoPromoProd: number;
    dctoCaducProd: number;
    precioFinalProd: number;
    stockProd: number;
    disponibleProd: string;
    estadoProd: string;
    descripcionProd: string;
    urlImgProd: string;
}

export class CProducto implements IProducto {

    constructor(
        private _ideProd: number,
        private _ideCate: number,
        private _ideMarc: number,
        private _codigoBarraProd: string,
        private _nombreProd: string,
        private _precioCompraProd: number,
        private _precioVentaProd: number,
        private _ivaProd: number,
        private _dctoPromoProd: number,
        private _dctoCaducProd: number,
        private _precioFinalProd: number,
        private _stockProd: number,
        private _disponibleProd: string,
        private _estadoProd: string,
        private _descripcionProd: string,
        private _urlImgProd: string
    ) {}

    // --- Getters / Setters ---

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

    get precioCompraProd() {
        return this._precioCompraProd;
    }
    set precioCompraProd(value: number) {
        this._precioCompraProd = value;
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

    get dctoCaducProd() {
        return this._dctoCaducProd;
    }
    set dctoCaducProd(value: number) {
        this._dctoCaducProd = value;
    }

    get precioFinalProd() {
        return this._precioFinalProd;
    }
    set precioFinalProd(value: number) {
        this._precioFinalProd = value;
    }

    get stockProd() {
        return this._stockProd;
    }
    set stockProd(value: number) {
        this._stockProd = value;
    }

    get disponibleProd() {
        return this._disponibleProd;
    }
    set disponibleProd(value: string) {
        this._disponibleProd = value;
    }

    get estadoProd() {
        return this._estadoProd;
    }
    set estadoProd(value: string) {
        this._estadoProd = value;
    }

    get descripcionProd() {
        return this._descripcionProd;
    }
    set descripcionProd(value: string) {
        this._descripcionProd = value;
    }

    get urlImgProd() {
        return this._urlImgProd;
    }
    set urlImgProd(value: string) {
        this._urlImgProd = value;
    }
}

export interface IProductoResult {
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
    disponible_prod: string;
    estado_prod: string;
    descripcion_prod: string;
    url_img_prod: string;
}

export interface IFiltroProducto {
    ideProd?: number;
    ideCate?: number;
    ideMarc?: number;
    codigoBarraProd?: string;
    nombreProd?: string;
    precioCompraProdMin?: number;
    precioCompraProdMax?: number;
    precioVentaProdMin?: number;
    precioVentaProdMax?: number;
    stockProdMin?: number;
    stockProdMax?: number;
    disponibleProd?: string;
    estadoProd?: string;
    urlImgProd?: string;
}