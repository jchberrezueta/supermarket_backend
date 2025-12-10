export interface ILote {
    ideLote: number;
    ideProd: number;
    fechaCaducidadLote: string;
    stockLote: number;
    estadoLote: string;
}

export class CLote implements ILote {

    constructor(
        private _ideLote: number,
        private _ideProd: number,
        private _fechaCaducidadLote: string,
        private _stockLote: number,
        private _estadoLote: string
    ) {}

    // --- Getters / Setters ---

    get ideLote() {
        return this._ideLote;
    }
    set ideLote(value: number) {
        this._ideLote = value;
    }

    get ideProd() {
        return this._ideProd;
    }
    set ideProd(value: number) {
        this._ideProd = value;
    }

    get fechaCaducidadLote() {
        return this._fechaCaducidadLote;
    }
    set fechaCaducidadLote(value: string) {
        this._fechaCaducidadLote = value;
    }

    get stockLote() {
        return this._stockLote;
    }
    set stockLote(value: number) {
        this._stockLote = value;
    }

    get estadoLote() {
        return this._estadoLote;
    }
    set estadoLote(value: string) {
        this._estadoLote = value;
    }
}

export interface ILoteResult {
    ide_lote: number;
    ide_prod: number;
    fecha_caducidad_lote: string;
    stock_lote: number;
    estado_lote: string;
}

export interface IFiltroLote {
    ideLote?: number;
    ideProd?: number;
    fechaCaducidadLoteDesde?: string;
    fechaCaducidadLoteHasta?: string;
    stockLoteMin?: number;
    stockLoteMax?: number;
    estadoLote?: string;
}