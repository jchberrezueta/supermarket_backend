export enum EnumEstadoEntrega {
    COMPLETO = 'completo',
    INCOMPLETO = 'incompleto'
}

export interface IEntrega {
    ideEntr: number;
    idePedi: number;
    ideProv: number;
    fechaEntr: string;
    cantidadTotalEntr: number;
    totalEntr: number;
    estadoEntr: EnumEstadoEntrega;
    observacionEntr: string;
}

export class CEntrega implements IEntrega {

    constructor(
        private _ideEntr: number,
        private _idePedi: number,
        private _ideProv: number,
        private _fechaEntr: string,
        private _cantidadTotalEntr: number,
        private _totalEntr: number,
        private _estadoEntr: EnumEstadoEntrega,
        private _observacionEntr: string
    ) {}

    // --- Getters / Setters ---

    get ideEntr() {
        return this._ideEntr;
    }
    set ideEntr(value: number) {
        this._ideEntr = value;
    }

    get idePedi() {
        return this._idePedi;
    }
    set idePedi(value: number) {
        this._idePedi = value;
    }

    get ideProv() {
        return this._ideProv;
    }
    set ideProv(value: number) {
        this._ideProv = value;
    }

    get fechaEntr() {
        return this._fechaEntr;
    }
    set fechaEntr(value: string) {
        this._fechaEntr = value;
    }

    get cantidadTotalEntr() {
        return this._cantidadTotalEntr;
    }
    set cantidadTotalEntr(value: number) {
        this._cantidadTotalEntr = value;
    }

    get totalEntr() {
        return this._totalEntr;
    }
    set totalEntr(value: number) {
        this._totalEntr = value;
    }

    get estadoEntr() {
        return this._estadoEntr;
    }
    set estadoEntr(value: EnumEstadoEntrega) {
        this._estadoEntr = value;
    }

    get observacionEntr() {
        return this._observacionEntr;
    }
    set observacionEntr(value: string) {
        this._observacionEntr = value;
    }
}

export interface IEntregaResult {
    ide_entr: number;
    ide_pedi: number;
    ide_prov: number;
    fecha_entr: string;
    cantidad_total_entr: number;
    total_entr: number;
    estado_entr: EnumEstadoEntrega;
    observacion_entr: string;
}

export interface IFiltroEntrega {
    ideEntr?: number;
    idePedi?: number;
    ideProv?: number;
    fechaEntrDesde?: string;
    fechaEntrHasta?: string;
    cantidadTotalEntrMin?: number;
    cantidadTotalEntrMax?: number;
    totalEntrMin?: number;
    totalEntrMax?: number;
    estadoEntr?: EnumEstadoEntrega;
}