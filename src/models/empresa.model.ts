
export enum EnumEstadosEmpresa {
    ACTIVO = 'activo',
    INACTIVO = 'inactivo'
}

export const ListEstadosEmpresa = [
    {
        label: 'Activo',
        value: EnumEstadosEmpresa.ACTIVO,
    },
    {
        label: 'Inactivo',
        value: EnumEstadosEmpresa.INACTIVO
    }
]

export class CEmpresa implements IEmpresa {

    constructor(
        private _ideEmp: number,
        private _nombreEmp: string,
        private _responsableEmp: string,
        private _fechaContratoEmp: string,
        private _direccionEmp: string,
        private _telefonoEmp: string,
        private _emailEmp: string,
        private _estadoEmp: EnumEstadosEmpresa,
        private _descripcionEmp: string
    ) {}

    // --- Getters / Setters ---

    get ideEmp() {
        return this._ideEmp;
    }
    set ideEmp(value: number) {
        this._ideEmp = value;
    }

    get nombreEmp() {
        return this._nombreEmp;
    }
    set nombreEmp(value: string) {
        this._nombreEmp = value;
    }

    get responsableEmp() {
        return this._responsableEmp;
    }
    set responsableEmp(value: string) {
        this._responsableEmp = value;
    }

    get fechaContratoEmp() {
        return this._fechaContratoEmp;
    }
    set fechaContratoEmp(value: string) {
        this._fechaContratoEmp = value;
    }

    get direccionEmp() {
        return this._direccionEmp;
    }
    set direccionEmp(value: string) {
        this._direccionEmp = value;
    }

    get telefonoEmp() {
        return this._telefonoEmp;
    }
    set telefonoEmp(value: string) {
        this._telefonoEmp = value;
    }

    get emailEmp() {
        return this._emailEmp;
    }
    set emailEmp(value: string) {
        this._emailEmp = value;
    }

    get estadoEmp() {
        return this._estadoEmp;
    }
    set estadoEmp(value: EnumEstadosEmpresa) {
        this._estadoEmp = value;
    }

    get descripcionEmp() {
        return this._descripcionEmp;
    }
    set descripcionEmp(value: string) {
        this._descripcionEmp = value;
    }
}

export interface IEmpresa {
    ideEmp: number;
    nombreEmp: string;
    responsableEmp: string;
    fechaContratoEmp: string;
    direccionEmp: string;
    telefonoEmp: string;
    emailEmp: string;
    estadoEmp: EnumEstadosEmpresa;
    descripcionEmp: string;
}

export interface IEmpresaResult {
    ide_empr: number;
    nombre_empr: string;
    responsable_empr: string;
    descripcion_empr: string;
    direccion_empr: string;
    telefono_empr: string;
    email_empr: string;
    fecha_contrato_empr: string;
    estado_empr: EnumEstadosEmpresa;
}

export interface IFiltroEmpresa {
    nombreEmp?: string;
    estadoEmp?: EnumEstadosEmpresa;
    responsableEmp?: string;
}