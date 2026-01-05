export enum EnumEstadoDetalleEntrega {
    COMPLETO = 'completo',
    INCOMPLETO = 'incompleto'
}

export interface IDetalleEntrega {
    ideDetaEntr: number;
    ideEntr: number;
    ideProd: number;
    cantidadProd: number;
    precioUnitarioProd: number;
    subtotalProd: number;
    dctoCompraProd: number;
    ivaProd: number;
    totalProd: number;
    dctoCaducProd: number;
    estadoDetaEntr: EnumEstadoDetalleEntrega;
}

export class CDetalleEntrega implements IDetalleEntrega {

    constructor(
        private _ideDetaEntr: number,
        private _ideEntr: number,
        private _ideProd: number,
        private _cantidadProd: number,
        private _precioUnitarioProd: number,
        private _subtotalProd: number,
        private _dctoCompraProd: number,
        private _ivaProd: number,
        private _totalProd: number,
        private _dctoCaducProd: number,
        private _estadoDetaEntr: EnumEstadoDetalleEntrega
    ) {}

    // --- Getters / Setters ---

    get ideDetaEntr() {
        return this._ideDetaEntr;
    }
    set ideDetaEntr(value: number) {
        this._ideDetaEntr = value;
    }

    get ideEntr() {
        return this._ideEntr;
    }
    set ideEntr(value: number) {
        this._ideEntr = value;
    }

    get ideProd() {
        return this._ideProd;
    }
    set ideProd(value: number) {
        this._ideProd = value;
    }

    get cantidadProd() {
        return this._cantidadProd;
    }
    set cantidadProd(value: number) {
        this._cantidadProd = value;
    }

    get precioUnitarioProd() {
        return this._precioUnitarioProd;
    }
    set precioUnitarioProd(value: number) {
        this._precioUnitarioProd = value;
    }

    get subtotalProd() {
        return this._subtotalProd;
    }
    set subtotalProd(value: number) {
        this._subtotalProd = value;
    }

    get dctoCompraProd() {
        return this._dctoCompraProd;
    }
    set dctoCompraProd(value: number) {
        this._dctoCompraProd = value;
    }

    get ivaProd() {
        return this._ivaProd;
    }
    set ivaProd(value: number) {
        this._ivaProd = value;
    }

    get totalProd() {
        return this._totalProd;
    }
    set totalProd(value: number) {
        this._totalProd = value;
    }

    get dctoCaducProd() {
        return this._dctoCaducProd;
    }
    set dctoCaducProd(value: number) {
        this._dctoCaducProd = value;
    }

    get estadoDetaEntr() {
        return this._estadoDetaEntr;
    }
    set estadoDetaEntr(value: EnumEstadoDetalleEntrega) {
        this._estadoDetaEntr = value;
    }
}

export interface IDetalleEntregaResult {
    ide_deta_entr: number;
    ide_entr: number;
    ide_prod: number;
    cantidad_prod: number;
    precio_unitario_prod: number;
    subtotal_prod: number;
    dcto_compra_prod: number;
    iva_prod: number;
    total_prod: number;
    dcto_caduc_prod: number;
    estado_deta_entr: EnumEstadoDetalleEntrega;
}

export interface IFiltroDetalleEntrega {
    ideDetaEntr?: number;
    ideEntr?: number;
    ideProd?: number;
    cantidadProdMin?: number;
    cantidadProdMax?: number;
    precioUnitarioProdMin?: number;
    precioUnitarioProdMax?: number;
    estadoDetaEntr?: EnumEstadoDetalleEntrega;
}