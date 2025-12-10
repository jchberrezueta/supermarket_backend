export enum EnumEstadosPedido {
    PROGRESO = 'progreso',
    COMPLETADO = 'completado',
    INCOMPLETO = 'incompleto'
}

export enum EnumMotivosPedido {
    PEDIDO = 'pedido',
    DEVOLUCION = 'devolucion'
}

export interface IPedido {
    idePedi: number;
    ideEmpr: number;
    fechaPedi: string;
    fechaEntrPedi: string;
    cantidadTotalPedi: number;
    totalPedi: number;
    estadoPedi: EnumEstadosPedido;
    motivoPedi: EnumMotivosPedido;
    observacionPedi: string;
}

export class CPedido implements IPedido {

    constructor(
        private _idePedi: number,
        private _ideEmpr: number,
        private _fechaPedi: string,
        private _fechaEntrPedi: string,
        private _cantidadTotalPedi: number,
        private _totalPedi: number,
        private _estadoPedi: EnumEstadosPedido,
        private _motivoPedi: EnumMotivosPedido,
        private _observacionPedi: string
    ) {}

    // --- Getters / Setters ---

    get idePedi() {
        return this._idePedi;
    }
    set idePedi(value: number) {
        this._idePedi = value;
    }

    get ideEmpr() {
        return this._ideEmpr;
    }
    set ideEmpr(value: number) {
        this._ideEmpr = value;
    }

    get fechaPedi() {
        return this._fechaPedi;
    }
    set fechaPedi(value: string) {
        this._fechaPedi = value;
    }

    get fechaEntrPedi() {
        return this._fechaEntrPedi;
    }
    set fechaEntrPedi(value: string) {
        this._fechaEntrPedi = value;
    }

    get cantidadTotalPedi() {
        return this._cantidadTotalPedi;
    }
    set cantidadTotalPedi(value: number) {
        this._cantidadTotalPedi = value;
    }

    get totalPedi() {
        return this._totalPedi;
    }
    set totalPedi(value: number) {
        this._totalPedi = value;
    }

    get estadoPedi() {
        return this._estadoPedi;
    }
    set estadoPedi(value: EnumEstadosPedido) {
        this._estadoPedi = value;
    }

    get motivoPedi() {
        return this._motivoPedi;
    }
    set motivoPedi(value: EnumMotivosPedido) {
        this._motivoPedi = value;
    }

    get observacionPedi() {
        return this._observacionPedi;
    }
    set observacionPedi(value: string) {
        this._observacionPedi = value;
    }
}

export interface IPedidoResult {
    ide_pedi: number;
    ide_empr: number;
    fecha_pedi: string;
    fecha_entr_pedi: string;
    cantidad_total_pedi: number;
    total_pedi: number;
    estado_pedi: EnumEstadosPedido;
    motivo_pedi: EnumMotivosPedido;
    observacion_pedi: string;
}

export interface IFiltroPedido {
    idePedi?: number;
    ideEmpr?: number;
    fechaPediDesde?: string;
    fechaPediHasta?: string;
    fechaEntrPediDesde?: string;
    fechaEntrPediHasta?: string;
    cantidadTotalPediMin?: number;
    cantidadTotalPediMax?: number;
    totalPediMin?: number;
    totalPediMax?: number;
    estadoPedi?: EnumEstadosPedido;
    motivoPedi?: EnumMotivosPedido;
}