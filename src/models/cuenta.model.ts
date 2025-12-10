export interface ICuenta {
    ideCuen: number;
    ideEmpl: number;
    idePerf: number;
    usuarioCuen: string;
    passwordCuen: string;
    estadoCuen: string;
}

export class CCuenta implements ICuenta {

    constructor(
        private _ideCuen: number,
        private _ideEmpl: number,
        private _idePerf: number,
        private _usuarioCuen: string,
        private _passwordCuen: string,
        private _estadoCuen: string
    ) {}

    // --- Getters / Setters ---

    get ideCuen() {
        return this._ideCuen;
    }
    set ideCuen(value: number) {
        this._ideCuen = value;
    }

    get ideEmpl() {
        return this._ideEmpl;
    }
    set ideEmpl(value: number) {
        this._ideEmpl = value;
    }

    get idePerf() {
        return this._idePerf;
    }
    set idePerf(value: number) {
        this._idePerf = value;
    }

    get usuarioCuen() {
        return this._usuarioCuen;
    }
    set usuarioCuen(value: string) {
        this._usuarioCuen = value;
    }

    get passwordCuen() {
        return this._passwordCuen;
    }
    set passwordCuen(value: string) {
        this._passwordCuen = value;
    }

    get estadoCuen() {
        return this._estadoCuen;
    }
    set estadoCuen(value: string) {
        this._estadoCuen = value;
    }
}

export interface ICuentaResult {
    ide_cuen: number;
    ide_empl: number;
    ide_perf: number;
    usuario_cuen: string;
    password_cuen: string;
    estado_cuen: string;
}

export interface IFiltroCuenta {
    ideCuen?: number;
    ideEmpl?: number;
    idePerf?: number;
    usuarioCuen?: string;
    estadoCuen?: string;
}