export interface IVenta {
    ideVent: number;
    ideEmpl: number;
    ideClie: number;
    numFacturaVent: string;
    fechaVent: string;
    cantidadVent: number;
    subTotalVent: number;
    totalVent: number;
    dctoVent: number;
    estadoVent: string;
}

export class CVenta implements IVenta {

    constructor(
        private _ideVent: number,
        private _ideEmpl: number,
        private _ideClie: number,
        private _numFacturaVent: string,
        private _fechaVent: string,
        private _cantidadVent: number,
        private _subTotalVent: number,
        private _totalVent: number,
        private _dctoVent: number,
        private _estadoVent: string
    ) {}

    // --- Getters / Setters ---

    get ideVent() {
        return this._ideVent;
    }
    set ideVent(value: number) {
        this._ideVent = value;
    }

    get ideEmpl() {
        return this._ideEmpl;
    }
    set ideEmpl(value: number) {
        this._ideEmpl = value;
    }

    get ideClie() {
        return this._ideClie;
    }
    set ideClie(value: number) {
        this._ideClie = value;
    }

    get numFacturaVent() {
        return this._numFacturaVent;
    }
    set numFacturaVent(value: string) {
        this._numFacturaVent = value;
    }

    get fechaVent() {
        return this._fechaVent;
    }
    set fechaVent(value: string) {
        this._fechaVent = value;
    }

    get cantidadVent() {
        return this._cantidadVent;
    }
    set cantidadVent(value: number) {
        this._cantidadVent = value;
    }

    get subTotalVent() {
        return this._subTotalVent;
    }
    set subTotalVent(value: number) {
        this._subTotalVent = value;
    }

    get totalVent() {
        return this._totalVent;
    }
    set totalVent(value: number) {
        this._totalVent = value;
    }

    get dctoVent() {
        return this._dctoVent;
    }
    set dctoVent(value: number) {
        this._dctoVent = value;
    }

    get estadoVent() {
        return this._estadoVent;
    }
    set estadoVent(value: string) {
        this._estadoVent = value;
    }
}

export interface IVentaResult {
    ide_vent: number;
    ide_empl: number;
    ide_clie: number;
    num_factura_vent: string;
    fecha_vent: string;
    cantidad_vent: number;
    sub_total_vent: number;
    total_vent: number;
    dcto_vent: number;
    estado_vent: string;
}

export interface IFiltroVenta {
    ideVent?: number;
    ideEmpl?: number;
    ideClie?: number;
    numFacturaVent?: string;
    fechaVentDesde?: string;
    fechaVentHasta?: string;
    cantidadVentMin?: number;
    cantidadVentMax?: number;
    subTotalVentMin?: number;
    subTotalVentMax?: number;
    totalVentMin?: number;
    totalVentMax?: number;
    estadoVent?: string;
}