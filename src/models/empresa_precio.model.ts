export interface IEmpresaPrecios {
    ideEmprProd: number;
    ideEmpr: number;
    ideProd: number;
    precioCompraProd: number;
    dctoCompraProd: number;
    dctoCaducidadProd: number;
    ivaProd: number;
}

export class CEmpresaPrecios implements IEmpresaPrecios {

    constructor(
        private _ideEmprProd: number,
        private _ideEmpr: number,
        private _ideProd: number,
        private _precioCompraProd: number,
        private _dctoCompraProd: number,
        private _dctoCaducidadProd: number,
        private _ivaProd: number
    ) {}

    // --- Getters / Setters ---

    get ideEmprProd() {
        return this._ideEmprProd;
    }
    set ideEmprProd(value: number) {
        this._ideEmprProd = value;
    }

    get ideEmpr() {
        return this._ideEmpr;
    }
    set ideEmpr(value: number) {
        this._ideEmpr = value;
    }

    get ideProd() {
        return this._ideProd;
    }
    set ideProd(value: number) {
        this._ideProd = value;
    }

    get precioCompraProd() {
        return this._precioCompraProd;
    }
    set precioCompraProd(value: number) {
        this._precioCompraProd = value;
    }

    get dctoCompraProd() {
        return this._dctoCompraProd;
    }
    set dctoCompraProd(value: number) {
        this._dctoCompraProd = value;
    }

    get dctoCaducidadProd() {
        return this._dctoCaducidadProd;
    }
    set dctoCaducidadProd(value: number) {
        this._dctoCaducidadProd = value;
    }

    get ivaProd() {
        return this._ivaProd;
    }
    set ivaProd(value: number) {
        this._ivaProd = value;
    }
}

export interface IEmpresaPreciosResult {
    ide_empr_prod: number;
    ide_empr: number;
    ide_prod: number;
    precio_compra_prod: number;
    dcto_compra_prod: number;
    dcto_caducidad_prod: number;
    iva_prod: number;
}

export interface IFiltroEmpresaPrecios {
    ideEmprProd?: number;
    ideEmpr?: number;
    ideProd?: number;
    precioCompraProdMin?: number;
    precioCompraProdMax?: number;
    dctoCompraProdMin?: number;
    dctoCompraProdMax?: number;
}