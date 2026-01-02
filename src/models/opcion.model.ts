export enum EnumEstadosOpcion {
    SI = 'si',
    no = 'no'
}

export interface IOpciones {
    ideOpci: number;
    nombreOpci: string;
    rutaOpci: string;
    nivelOpci: number;
    padreOpci?: number | null;
    iconoOpci?: string | null;
    activoOpci: EnumEstadosOpcion;
    descripcionOpci: string;
}

export class COpciones implements IOpciones {

    constructor(
        private _ideOpci: number,
        private _nombreOpci: string,
        private _rutaOpci: string,
        private _activoOpci: EnumEstadosOpcion,
        private _descripcionOpci: string,
        private _nivelOpci: number,
        private _padreOpci?: number | null,
        private _iconoOpci?: string | null
    ) {}

    // --- Getters / Setters ---

    get ideOpci() {
        return this._ideOpci;
    }
    set ideOpci(value: number) {
        this._ideOpci = value;
    }

    get nombreOpci() {
        return this._nombreOpci;
    }
    set nombreOpci(value: string) {
        this._nombreOpci = value;
    }

    get rutaOpci() {
        return this._rutaOpci;
    }
    set rutaOpci(value: string) {
        this._rutaOpci = value;
    }

    get activoOpci() {
        return this._activoOpci;
    }
    set activoOpci(value: EnumEstadosOpcion) {
        this._activoOpci = value;
    }

    get descripcionOpci() {
        return this._descripcionOpci;
    }
    set descripcionOpci(value: string) {
        this._descripcionOpci = value;
    }

    get nivelOpci() {
        return this._nivelOpci;
    }
    set nivelOpci(value: number | null) {
        this._nivelOpci = value;
    }

    get padreOpci() {
        return this._padreOpci;
    }
    set padreOpci(value: number | null | undefined) {
        this._padreOpci = value;
    }

    get iconoOpci() {
        return this._iconoOpci;
    }
    set iconoOpci(value: string | null | undefined) {
        this._iconoOpci = value;
    }
}

export interface IOpcionesResult {
    ide_opci: number;
    nombre_opci: string;
    ruta_opci: string;
    activo_opci: EnumEstadosOpcion;
    descripcion_opci: string;
    nivel_opci: number;
    padre_opci: number | null;
    icono_opci: string | null;
}

export interface IFiltroOpciones {
    ideOpci?: number;
    nombreOpci?: string;
    rutaOpci?: string;
    activoOpci?: EnumEstadosOpcion;
    nivelOpci?: number;
    padreOpci?: number;
    iconoOpci?: string;
}