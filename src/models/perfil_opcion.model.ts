export interface IPerfilOpciones {
    idePerfOpci: number;
    idePerf: number;
    ideOpci: number;
    listar: string;
    insertar: string;
    modificar: string;
    eliminar: string;
}

export class CPerfilOpciones implements IPerfilOpciones {

    constructor(
        private _idePerfOpci: number,
        private _idePerf: number,
        private _ideOpci: number,
        private _listar: string,
        private _insertar: string,
        private _modificar: string,
        private _eliminar: string
    ) {}

    // --- Getters / Setters ---

    get idePerfOpci() {
        return this._idePerfOpci;
    }
    set idePerfOpci(value: number) {
        this._idePerfOpci = value;
    }

    get idePerf() {
        return this._idePerf;
    }
    set idePerf(value: number) {
        this._idePerf = value;
    }

    get ideOpci() {
        return this._ideOpci;
    }
    set ideOpci(value: number) {
        this._ideOpci = value;
    }

    get listar() {
        return this._listar;
    }
    set listar(value: string) {
        this._listar = value;
    }

    get insertar() {
        return this._insertar;
    }
    set insertar(value: string) {
        this._insertar = value;
    }

    get modificar() {
        return this._modificar;
    }
    set modificar(value: string) {
        this._modificar = value;
    }

    get eliminar() {
        return this._eliminar;
    }
    set eliminar(value: string) {
        this._eliminar = value;
    }
}

export interface IPerfilOpcionesResult {
    ide_perf_opci: number;
    ide_perf: number;
    ide_opci: number;
    listar: string;
    insertar: string;
    modificar: string;
    eliminar: string;
}

export interface IFiltroPerfilOpciones {
    idePerfOpci?: number;
    idePerf?: number;
    ideOpci?: number;
    listar?: string;
    insertar?: string;
    modificar?: string;
    eliminar?: string;
}