import { OpcionesEntity } from '@entities';

export interface OpcionRow {
  ide_opci: number;
  nombre_opci: string;
  ruta_opci: string;
  activo_opci: string;
  descripcion_opci: string;
  nivel_opci: number;
  padre_opci?: number | null;
  icono_opci?: string | null;
  usua_ingre?: string;
  fecha_ingre?: Date;
  usua_actua?: string;
  fecha_actua?: Date;
}

export class OpcionesMapper {
  static toRow(opcion: OpcionesEntity): OpcionRow {
    return {
      ide_opci: opcion.ideOpci,
      nombre_opci: opcion.nombreOpci,
      ruta_opci: opcion.rutaOpci,
      activo_opci: opcion.activoOpci,
      descripcion_opci: opcion.descripcionOpci,
      nivel_opci: opcion.nivelOpci,
      padre_opci: opcion.padreOpci ?? null,
      icono_opci: opcion.iconoOpci ?? null,
      usua_ingre: opcion.usuaIngre,
      fecha_ingre: opcion.fechaIngre,
      usua_actua: opcion.usuaActua,
      fecha_actua: opcion.fechaActua,
    };
  }

  static toRows(opciones: OpcionesEntity[]): OpcionRow[] {
    return opciones.map((opcion) => this.toRow(opcion));
  }
}
