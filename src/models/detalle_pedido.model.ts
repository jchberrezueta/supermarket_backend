export interface IDetallePedido {
    ideDetaPedi: number;
    idePedi: number;
    ideProd: number;
    cantidadProd: number;
    precioUnitarioProd: number;
    subtotalProd: number;
    dctoCompraProd: number;
    ivaProd: number;
    totalProd: number;
    dctoCaducProd: number;
}

export class CDetallePedido implements IDetallePedido {

    constructor(
        private _ideDetaPedi: number,
        private _idePedi: number,
        private _ideProd: number,
        private _cantidadProd: number,
        private _precioUnitarioProd: number,
        private _subtotalProd: number,
        private _dctoCompraProd: number,
        private _ivaProd: number,
        private _totalProd: number,
        private _dctoCaducProd: number
    ) {}

    // --- Getters / Setters ---

    get ideDetaPedi() {
        return this._ideDetaPedi;
    }
    set ideDetaPedi(value: number) {
        this._ideDetaPedi = value;
    }

    get idePedi() {
        return this._idePedi;
    }
    set idePedi(value: number) {
        this._idePedi = value;
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
}

export interface IDetallePedidoResult {
    ide_deta_pedi: number;
    ide_pedi: number;
    ide_prod: number;
    cantidad_prod: number;
    precio_unitario_prod: number;
    subtotal_prod: number;
    dcto_compra_prod: number;
    iva_prod: number;
    total_prod: number;
    dcto_caduc_prod: number;
}

export interface IFiltroDetallePedido {
    ideDetaPedi?: number;
    idePedi?: number;
    ideProd?: number;
    cantidadProdMin?: number;
    cantidadProdMax?: number;
    precioUnitarioProdMin?: number;
    precioUnitarioProdMax?: number;
    subtotalProdMin?: number;
    subtotalProdMax?: number;
}