export interface IProveedor {
    ideProv: number;
    ideEmpr: number;
    cedulaProv: string;
    fechaNacimientoProv: string;
    edadProv: number;
    telefonoProv: string;
    emailProv: string;
    primerNombreProv: string;
    apellidoPaternoProv: string;
    segundoNombreProv?: string | null;
    apellidoMaternoProv?: string | null;
}

export class CProveedor implements IProveedor {

    constructor(
        private _ideProv: number,
        private _ideEmpr: number,
        private _cedulaProv: string,
        private _fechaNacimientoProv: string,
        private _edadProv: number,
        private _telefonoProv: string,
        private _emailProv: string,
        private _primerNombreProv: string,
        private _apellidoPaternoProv: string,
        private _segundoNombreProv?: string | null,
        private _apellidoMaternoProv?: string | null
    ) {}

    // --- Getters / Setters ---

    get ideProv() {
        return this._ideProv;
    }
    set ideProv(value: number) {
        this._ideProv = value;
    }

    get ideEmpr() {
        return this._ideEmpr;
    }
    set ideEmpr(value: number) {
        this._ideEmpr = value;
    }

    get cedulaProv() {
        return this._cedulaProv;
    }
    set cedulaProv(value: string) {
        this._cedulaProv = value;
    }

    get fechaNacimientoProv() {
        return this._fechaNacimientoProv;
    }
    set fechaNacimientoProv(value: string) {
        this._fechaNacimientoProv = value;
    }

    get edadProv() {
        return this._edadProv;
    }
    set edadProv(value: number) {
        this._edadProv = value;
    }

    get telefonoProv() {
        return this._telefonoProv;
    }
    set telefonoProv(value: string) {
        this._telefonoProv = value;
    }

    get emailProv() {
        return this._emailProv;
    }
    set emailProv(value: string) {
        this._emailProv = value;
    }

    get primerNombreProv() {
        return this._primerNombreProv;
    }
    set primerNombreProv(value: string) {
        this._primerNombreProv = value;
    }

    get apellidoPaternoProv() {
        return this._apellidoPaternoProv;
    }
    set apellidoPaternoProv(value: string) {
        this._apellidoPaternoProv = value;
    }

    get segundoNombreProv() {
        return this._segundoNombreProv;
    }
    set segundoNombreProv(value: string | null | undefined) {
        this._segundoNombreProv = value;
    }

    get apellidoMaternoProv() {
        return this._apellidoMaternoProv;
    }
    set apellidoMaternoProv(value: string | null | undefined) {
        this._apellidoMaternoProv = value;
    }
}

export interface IProveedorResult {
    ide_prov: number;
    ide_empr: number;
    cedula_prov: string;
    fecha_nacimiento_prov: string;
    edad_prov: number;
    telefono_prov: string;
    email_prov: string;
    primer_nombre_prov: string;
    apellido_paterno_prov: string;
    segundo_nombre_prov: string | null;
    apellido_materno_prov: string | null;
}

export interface IFiltroProveedor {
    ideEmpr?: number;
    cedulaProv?: string;
    primerNombreProv?: string;
    apellidoPaternoProv?: string;
    emailProv?: string;
}