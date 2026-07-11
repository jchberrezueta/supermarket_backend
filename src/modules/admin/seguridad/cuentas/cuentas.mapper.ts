import { CuentaEntity, EmpleadoEntity } from '@entities';

export interface CuentaRow {
  ide_cuen: number;
  ide_empl: number;
  nombre_empleado?: string | null;
  ide_perf: number;
  nombre_perf?: string | null;
  usuario_cuen: string;
  password_cuen: string;
  estado_cuen: string;
  debe_cambiar_clave: boolean;
  usua_ingre?: string;
  fecha_ingre?: Date;
  usua_actua?: string;
  fecha_actua?: Date;
}

export interface CuentaAuthRaw {
  ide_cuen: number;
  ide_empl: number;
  ide_perf: number;
  usuario_cuen: string;
  password_cuen: string;
  estado_cuen: string;
  debe_cambiar_clave: boolean;
}

export class CuentasMapper {
  static toRow(cuenta: CuentaEntity): CuentaRow {
    return {
      ide_cuen: cuenta.ideCuen,
      ide_empl: cuenta.ideEmpl,
      nombre_empleado: cuenta.empleado
        ? this.getNombreEmpleado(cuenta.empleado)
        : null,
      ide_perf: cuenta.idePerf,
      nombre_perf: cuenta.perfil?.nombrePerf ?? null,
      usuario_cuen: cuenta.usuarioCuen,
      password_cuen: '',
      estado_cuen: cuenta.estadoCuen,
      debe_cambiar_clave: cuenta.debeCambiarClave ?? false,
      usua_ingre: cuenta.usuaIngre,
      fecha_ingre: cuenta.fechaIngre,
      usua_actua: cuenta.usuaActua,
      fecha_actua: cuenta.fechaActua,
    };
  }

  static toRows(cuentas: CuentaEntity[]): CuentaRow[] {
    return cuentas.map((cuenta) => this.toRow(cuenta));
  }

  static toAuthRaw(cuenta: CuentaEntity): CuentaAuthRaw {
    return {
      ide_cuen: cuenta.ideCuen,
      ide_empl: cuenta.ideEmpl,
      ide_perf: cuenta.idePerf,
      usuario_cuen: cuenta.usuarioCuen,
      password_cuen: cuenta.passwordCuen,
      estado_cuen: cuenta.estadoCuen,
      debe_cambiar_clave: cuenta.debeCambiarClave ?? false,
    };
  }

  private static getNombreEmpleado(empleado: EmpleadoEntity): string {
    return [
      empleado.primerNombreEmpl,
      empleado.segundoNombreEmpl,
      empleado.apellidoPaternoEmpl,
      empleado.apellidoMaternoEmpl,
    ]
      .filter((value) => !!value)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
