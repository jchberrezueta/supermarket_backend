export interface IDetalleVenta {
    ideDetaVent: number;
    ideVent: number;
    ideProd: number;
    cantidadProd: number;
    precioUnitarioProd: number;
    subtotalProd: number;
    dctoProd: number;
    dctoPromo: number;
    ivaProd: number;
}

export class CDetalleVenta implements IDetalleVenta {

    constructor(
        private _ideDetaVent: number,
        private _ideVent: number,
        private _ideProd: number,
        private _cantidadProd: number,
        private _precioUnitarioProd: number,
        private _subtotalProd: number,
        private _dctoProd: number,
        private _dctoPromo: number,
        private _ivaProd: number
    ) {}

    // --- Getters / Setters ---

    get ideDetaVent() {
        return this._ideDetaVent;
    }
    set ideDetaVent(value: number) {
        this._ideDetaVent = value;
    }

    get ideVent() {
        return this._ideVent;
    }
    set ideVent(value: number) {
        this._ideVent = value;
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

    get dctoProd() {
        return this._dctoProd;
    }
    set dctoProd(value: number) {
        this._dctoProd = value;
    }

    get dctoPromo() {
        return this._dctoPromo;
    }
    set dctoPromo(value: number) {
        this._dctoPromo = value;
    }

    get ivaProd() {
        return this._ivaProd;
    }
    set ivaProd(value: number) {
        this._ivaProd = value;
    }
}

export interface IDetalleVentaResult {
    ide_deta_vent: number;
    ide_vent: number;
    ide_prod: number;
    cantidad_prod: number;
    precio_unitario_prod: number;
    subtotal_prod: number;
    dcto_prod: number;
    dcto_promo: number;
    iva_prod: number;
}

export interface IFiltroDetalleVenta {
    ideDetaVent?: number;
    ideVent?: number;
    ideProd?: number;
    cantidadProdMin?: number;
    cantidadProdMax?: number;
    precioUnitarioProdMin?: number;
    precioUnitarioProdMax?: number;
    subtotalProdMin?: number;
    subtotalProdMax?: number;
}