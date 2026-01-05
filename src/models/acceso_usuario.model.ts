export interface IAccesoUsuario {
    ideAcce: number;
    ideCuen: number;
    navegadorAcce: string;
    fechaAcce: string;
    numIntFallAcce: number;
    ipAcce: string;
    latitudAcce?: number | null;
    longitudAcce?: number | null;
}

export class CAccesoUsuario implements IAccesoUsuario {

    constructor(
        private _ideAcce: number,
        private _ideCuen: number,
        private _navegadorAcce: string,
        private _fechaAcce: string,
        private _numIntFallAcce: number,
        private _ipAcce: string,
        private _latitudAcce?: number | null,
        private _longitudAcce?: number | null
    ) {}

    // --- Getters / Setters ---

    get ideAcce() {
        return this._ideAcce;
    }
    set ideAcce(value: number) {
        this._ideAcce = value;
    }

    get ideCuen() {
        return this._ideCuen;
    }
    set ideCuen(value: number) {
        this._ideCuen = value;
    }

    get navegadorAcce() {
        return this._navegadorAcce;
    }
    set navegadorAcce(value: string) {
        this._navegadorAcce = value;
    }

    get fechaAcce() {
        return this._fechaAcce;
    }
    set fechaAcce(value: string) {
        this._fechaAcce = value;
    }

    get numIntFallAcce() {
        return this._numIntFallAcce;
    }
    set numIntFallAcce(value: number) {
        this._numIntFallAcce = value;
    }

    get ipAcce() {
        return this._ipAcce;
    }
    set ipAcce(value: string) {
        this._ipAcce = value;
    }

    get latitudAcce() {
        return this._latitudAcce;
    }
    set latitudAcce(value: number | null | undefined) {
        this._latitudAcce = value;
    }

    get longitudAcce() {
        return this._longitudAcce;
    }
    set longitudAcce(value: number | null | undefined) {
        this._longitudAcce = value;
    }
}

export interface IAccesoUsuarioResult {
    ide_acce: number;
    ide_cuen: number;
    navegador_acce: string;
    fecha_acce: string;
    num_int_fall_acce: number;
    ip_acce: string;
    latitud_acce: number | null;
    longitud_acce: number | null;
}

export interface IFiltroAccesoUsuario {
    ideCuen?: number;
    navegadorAcce?: string;
    fechaAcceDesde?: string;
    fechaAcceHasta?: string;
    ipAcce?: string;
}