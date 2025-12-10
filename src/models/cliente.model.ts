export interface ICliente {
    ideClie: number;
    cedulaClie: string;
    fechaNacimientoClie: string;
    edadClie: number;
    telefonoClie: string;
    primerNombreClie: string;
    apellidoPaternoClie: string;
    emailClie: string;
    esSocio: string;
    esTerceraEdad: string;
    segundoNombreClie: string;
    apellidoMaternoClie: string;
}

export class CCliente implements ICliente {

    constructor(
        private _ideClie: number,
        private _cedulaClie: string,
        private _fechaNacimientoClie: string,
        private _edadClie: number,
        private _telefonoClie: string,
        private _primerNombreClie: string,
        private _apellidoPaternoClie: string,
        private _emailClie: string,
        private _esSocio: string,
        private _esTerceraEdad: string,
        private _segundoNombreClie: string,
        private _apellidoMaternoClie: string
    ) {}

    // --- Getters / Setters ---

    get ideClie() {
        return this._ideClie;
    }
    set ideClie(value: number) {
        this._ideClie = value;
    }

    get cedulaClie() {
        return this._cedulaClie;
    }
    set cedulaClie(value: string) {
        this._cedulaClie = value;
    }

    get fechaNacimientoClie() {
        return this._fechaNacimientoClie;
    }
    set fechaNacimientoClie(value: string) {
        this._fechaNacimientoClie = value;
    }

    get edadClie() {
        return this._edadClie;
    }
    set edadClie(value: number) {
        this._edadClie = value;
    }

    get telefonoClie() {
        return this._telefonoClie;
    }
    set telefonoClie(value: string) {
        this._telefonoClie = value;
    }

    get primerNombreClie() {
        return this._primerNombreClie;
    }
    set primerNombreClie(value: string) {
        this._primerNombreClie = value;
    }

    get apellidoPaternoClie() {
        return this._apellidoPaternoClie;
    }
    set apellidoPaternoClie(value: string) {
        this._apellidoPaternoClie = value;
    }

    get emailClie() {
        return this._emailClie;
    }
    set emailClie(value: string) {
        this._emailClie = value;
    }

    get esSocio() {
        return this._esSocio;
    }
    set esSocio(value: string) {
        this._esSocio = value;
    }

    get esTerceraEdad() {
        return this._esTerceraEdad;
    }
    set esTerceraEdad(value: string) {
        this._esTerceraEdad = value;
    }

    get segundoNombreClie() {
        return this._segundoNombreClie;
    }
    set segundoNombreClie(value: string) {
        this._segundoNombreClie = value;
    }

    get apellidoMaternoClie() {
        return this._apellidoMaternoClie;
    }
    set apellidoMaternoClie(value: string) {
        this._apellidoMaternoClie = value;
    }
}

export interface IClienteResult {
    ide_clie: number;
    cedula_clie: string;
    fecha_nacimiento_clie: string;
    edad_clie: number;
    telefono_clie: string;
    primer_nombre_clie: string;
    apellido_paterno_clie: string;
    email_clie: string;
    es_socio: string;
    es_tercera_edad: string;
    segundo_nombre_clie: string;
    apellido_materno_clie: string;
}

export interface IFiltroCliente {
    cedulaClie?: string;
    primerNombreClie?: string;
    apellidoPaternoClie?: string;
    emailClie?: string;
    esSocio?: string;
    esTerceraEdad?: string;
}