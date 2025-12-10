export interface IRol {
    ideRol: number;
    nombreRol: string;
    descripcionRol: string;
}

export class CRol implements IRol {

    constructor(
        private _ideRol: number,
        private _nombreRol: string,
        private _descripcionRol: string
    ) {}

    // --- Getters / Setters ---

    get ideRol() {
        return this._ideRol;
    }
    set ideRol(value: number) {
        this._ideRol = value;
    }

    get nombreRol() {
        return this._nombreRol;
    }
    set nombreRol(value: string) {
        this._nombreRol = value;
    }

    get descripcionRol() {
        return this._descripcionRol;
    }
    set descripcionRol(value: string) {
        this._descripcionRol = value;
    }
}

export interface IRolResult {
    ide_rol: number;
    nombre_rol: string;
    descripcion_rol: string;
}

export interface IFiltroRol {
    ideRol?: number;
    nombreRol?: string;
    descripcionRol?: string;
}