export interface IMarca {
    ideMarc: number;
    nombreMarc: string;
    paisOrigenMarc: string;
    calidadMarc: number;
    descripcionMarc: string;
}

export class CMarca implements IMarca {

    constructor(
        private _ideMarc: number,
        private _nombreMarc: string,
        private _paisOrigenMarc: string,
        private _calidadMarc: number,
        private _descripcionMarc: string
    ) {}

    // --- Getters / Setters ---

    get ideMarc() {
        return this._ideMarc;
    }
    set ideMarc(value: number) {
        this._ideMarc = value;
    }

    get nombreMarc() {
        return this._nombreMarc;
    }
    set nombreMarc(value: string) {
        this._nombreMarc = value;
    }

    get paisOrigenMarc() {
        return this._paisOrigenMarc;
    }
    set paisOrigenMarc(value: string) {
        this._paisOrigenMarc = value;
    }

    get calidadMarc() {
        return this._calidadMarc;
    }
    set calidadMarc(value: number) {
        this._calidadMarc = value;
    }

    get descripcionMarc() {
        return this._descripcionMarc;
    }
    set descripcionMarc(value: string) {
        this._descripcionMarc = value;
    }
}

export interface IMarcaResult {
    ide_marc: number;
    nombre_marc: string;
    pais_origen_marc: string;
    calidad_marc: number;
    descripcion_marc: string;
}

export interface IFiltroMarca {
    ideMarc?: number;
    nombreMarc?: string;
    paisOrigenMarc?: string;
    calidadMarcMin?: number;
    calidadMarcMax?: number;
    descripcionMarc?: string;
}