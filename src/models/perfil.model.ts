export interface IPerfil {
    idePerf: number;
    ideRol: number;
    nombrePerf: string;
    descripcionPerf: string;
}

export class CPerfil implements IPerfil {

    constructor(
        private _idePerf: number,
        private _ideRol: number,
        private _nombrePerf: string,
        private _descripcionPerf: string
    ) {}

    // --- Getters / Setters ---

    get idePerf() {
        return this._idePerf;
    }
    set idePerf(value: number) {
        this._idePerf = value;
    }

    get ideRol() {
        return this._ideRol;
    }
    set ideRol(value: number) {
        this._ideRol = value;
    }

    get nombrePerf() {
        return this._nombrePerf;
    }
    set nombrePerf(value: string) {
        this._nombrePerf = value;
    }

    get descripcionPerf() {
        return this._descripcionPerf;
    }
    set descripcionPerf(value: string) {
        this._descripcionPerf = value;
    }
}

export interface IPerfilResult {
    ide_perf: number;
    ide_rol: number;
    nombre_perf: string;
    descripcion_perf: string;
}

export interface IFiltroPerfil {
    idePerf?: number;
    ideRol?: number;
    nombrePerf?: string;
    descripcionPerf?: string;
}