import { MoneyUtil } from '@common/utils/money.util';
import { EmpleadoEntity } from '@entities';

export interface EmpleadoRow {
  ide_empl: number;
  ide_rol: number;
  nombre_rol?: string | null;
  cedula_empl: string;
  fecha_nacimiento_empl: string;
  edad_empl: number;
  fecha_inicio_empl: string;
  primer_nombre_empl: string;
  apellido_paterno_empl: string;
  rmu_empl: number;
  titulo_empl: string;
  estado_empl: string;
  segundo_nombre_empl?: string | null;
  apellido_materno_empl?: string | null;
  fecha_termino_empl?: string | null;
  usua_ingre?: string;
  fecha_ingre?: Date;
  usua_actua?: string;
  fecha_actua?: Date;
}

export interface EmpleadoRolRow {
  ide_empl: number;
  ide_rol: number;
  nombre_rol?: string | null;
  cedula_empl: string;
  nombre_completo: string;
  fecha_nacimiento_empl: string;
  edad_empl: number;
  fecha_inicio_empl: string;
  fecha_termino_empl?: string | null;
  telefono_empl?: string | null;
  titulo_empl: string;
  rmu_empl: number;
  estado_empl: string;
}

export class EmpleadosMapper {
  static toRow(empleado: EmpleadoEntity): EmpleadoRow {
    return {
      ide_empl: empleado.ideEmpl,
      ide_rol: empleado.ideRol,
      nombre_rol: empleado.rol?.nombreRol ?? null,
      cedula_empl: empleado.cedulaEmpl,
      fecha_nacimiento_empl: this.formatDate(empleado.fechaNacimientoEmpl),
      edad_empl: empleado.edadEmpl,
      fecha_inicio_empl: this.formatDate(empleado.fechaInicioEmpl),
      primer_nombre_empl: empleado.primerNombreEmpl,
      apellido_paterno_empl: empleado.apellidoPaternoEmpl,
      rmu_empl: MoneyUtil.toNumber(empleado.rmuEmpl),
      titulo_empl: empleado.tituloEmpl,
      estado_empl: empleado.estadoEmpl,
      segundo_nombre_empl: empleado.segundoNombreEmpl ?? null,
      apellido_materno_empl: empleado.apellidoMaternoEmpl ?? null,
      fecha_termino_empl: empleado.fechaTerminoEmpl
        ? this.formatDate(empleado.fechaTerminoEmpl)
        : null,
      usua_ingre: empleado.usuaIngre,
      fecha_ingre: empleado.fechaIngre,
      usua_actua: empleado.usuaActua,
      fecha_actua: empleado.fechaActua,
    };
  }

  static toRows(empleados: EmpleadoEntity[]): EmpleadoRow[] {
    return empleados.map((empleado) => this.toRow(empleado));
  }

  static toRolRow(empleado: EmpleadoEntity): EmpleadoRolRow {
    return {
      ide_empl: empleado.ideEmpl,
      ide_rol: empleado.ideRol,
      nombre_rol: empleado.rol?.nombreRol ?? null,
      cedula_empl: empleado.cedulaEmpl,
      nombre_completo: this.getNombreCompleto(empleado),
      fecha_nacimiento_empl: this.formatDate(empleado.fechaNacimientoEmpl),
      edad_empl: empleado.edadEmpl,
      fecha_inicio_empl: this.formatDate(empleado.fechaInicioEmpl),
      fecha_termino_empl: empleado.fechaTerminoEmpl
        ? this.formatDate(empleado.fechaTerminoEmpl)
        : null,
      telefono_empl: null,
      titulo_empl: empleado.tituloEmpl,
      rmu_empl: MoneyUtil.toNumber(empleado.rmuEmpl),
      estado_empl: empleado.estadoEmpl,
    };
  }

  static toRolRows(empleados: EmpleadoEntity[]): EmpleadoRolRow[] {
    return empleados.map((empleado) => this.toRolRow(empleado));
  }

  static getNombreCompleto(empleado: EmpleadoEntity): string {
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

  private static formatDate(value: Date | string): string {
    if (!value) {
      return '';
    }

    const dateText =
      value instanceof Date ? value.toISOString().slice(0, 10) : String(value);

    return dateText.slice(0, 10);
  }
}
