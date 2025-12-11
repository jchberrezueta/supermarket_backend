export enum EnumEstadoEmpleado {
    ACTIVO = 'activo',
    INACTIVO = 'inactivo'
}

export interface IEmpleado {
    ideEmpl: number;
    ideRol: number;
    cedulaEmpl: string;
    fechaNacimientoEmpl: string;
    edadEmpl: number;
    fechaInicioEmpl: string;
    primerNombreEmpl: string;
    apellidoPaternoEmpl: string;
    rmuEmpl: number;
    tituloEmpl: string;
    estadoEmpl: EnumEstadoEmpleado;
    segundoNombreEmpl?: string | null;
    apellidoMaternoEmpl?: string | null;
    fechaTerminoEmpl?: string | null;
}

export class CEmpleado implements IEmpleado {

    constructor(
        private _ideEmpl: number,
        private _ideRol: number,
        private _cedulaEmpl: string,
        private _fechaNacimientoEmpl: string,
        private _edadEmpl: number,
        private _fechaInicioEmpl: string,
        private _primerNombreEmpl: string,
        private _apellidoPaternoEmpl: string,
        private _rmuEmpl: number,
        private _tituloEmpl: string,
        private _estadoEmpl: EnumEstadoEmpleado,
        private _segundoNombreEmpl?: string | null,
        private _apellidoMaternoEmpl?: string | null,
        private _fechaTerminoEmpl?: string | null
    ) {}

    // --- Getters / Setters ---

    get ideEmpl() {
        return this._ideEmpl;
    }
    set ideEmpl(value: number) {
        this._ideEmpl = value;
    }

    get ideRol() {
        return this._ideRol;
    }
    set ideRol(value: number) {
        this._ideRol = value;
    }

    get cedulaEmpl() {
        return this._cedulaEmpl;
    }
    set cedulaEmpl(value: string) {
        this._cedulaEmpl = value;
    }

    get fechaNacimientoEmpl() {
        return this._fechaNacimientoEmpl;
    }
    set fechaNacimientoEmpl(value: string) {
        this._fechaNacimientoEmpl = value;
    }

    get edadEmpl() {
        return this._edadEmpl;
    }
    set edadEmpl(value: number) {
        this._edadEmpl = value;
    }

    get fechaInicioEmpl() {
        return this._fechaInicioEmpl;
    }
    set fechaInicioEmpl(value: string) {
        this._fechaInicioEmpl = value;
    }

    get primerNombreEmpl() {
        return this._primerNombreEmpl;
    }
    set primerNombreEmpl(value: string) {
        this._primerNombreEmpl = value;
    }

    get apellidoPaternoEmpl() {
        return this._apellidoPaternoEmpl;
    }
    set apellidoPaternoEmpl(value: string) {
        this._apellidoPaternoEmpl = value;
    }

    get rmuEmpl() {
        return this._rmuEmpl;
    }
    set rmuEmpl(value: number) {
        this._rmuEmpl = value;
    }

    get tituloEmpl() {
        return this._tituloEmpl;
    }
    set tituloEmpl(value: string) {
        this._tituloEmpl = value;
    }

    get estadoEmpl() {
        return this._estadoEmpl;
    }
    set estadoEmpl(value: EnumEstadoEmpleado) {
        this._estadoEmpl = value;
    }

    get segundoNombreEmpl() {
        return this._segundoNombreEmpl;
    }
    set segundoNombreEmpl(value: string | null) {
        this._segundoNombreEmpl = value;
    }

    get apellidoMaternoEmpl() {
        return this._apellidoMaternoEmpl;
    }
    set apellidoMaternoEmpl(value: string | null) {
        this._apellidoMaternoEmpl = value;
    }

    get fechaTerminoEmpl() {
        return this._fechaTerminoEmpl;
    }
    set fechaTerminoEmpl(value: string | null) {
        this._fechaTerminoEmpl = value;
    }
}

export interface IEmpleadoResult {
    ide_empl: number;
    ide_rol: number;
    cedula_empl: string;
    fecha_nacimiento_empl: string;
    edad_empl: number;
    fecha_inicio_empl: string;
    primer_nombre_empl: string;
    apellido_paterno_empl: string;
    rmu_empl: number;
    titulo_empl: string;
    estado_empl: EnumEstadoEmpleado;
    segundo_nombre_empl: string | null;
    apellido_materno_empl: string | null;
    fecha_termino_empl: string | null;
}

export interface IFiltroEmpleado {
    ideEmpl?: number;
    ideRol?: number;
    cedulaEmpl?: string;
    primerNombreEmpl?: string;
    apellidoPaternoEmpl?: string;
    estadoEmpl?: EnumEstadoEmpleado;
    rmuEmplMin?: number;
    rmuEmplMax?: number;
    fechaInicioEmplDesde?: string;
    fechaInicioEmplHasta?: string;
}