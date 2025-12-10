export interface ICategoria {
    ideCate: number;
    nombreCate: string;
    descripcionCate: string;
}

export class CCategoria implements ICategoria {

    constructor(
        private _ideCate: number,
        private _nombreCate: string,
        private _descripcionCate: string
    ) {}

    // --- Getters / Setters ---

    get ideCate() {
        return this._ideCate;
    }
    set ideCate(value: number) {
        this._ideCate = value;
    }

    get nombreCate() {
        return this._nombreCate;
    }
    set nombreCate(value: string) {
        this._nombreCate = value;
    }

    get descripcionCate() {
        return this._descripcionCate;
    }
    set descripcionCate(value: string) {
        this._descripcionCate = value;
    }
}

export interface ICategoriaResult {
    ide_cate: number;
    nombre_cate: string;
    descripcion_cate: string;
}

export interface IFiltroCategoria {
    nombreCate?: string;
    descripcionCate?: string;
}