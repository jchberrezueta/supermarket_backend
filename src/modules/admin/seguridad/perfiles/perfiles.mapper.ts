import { PerfilEntity } from '@entities';

export interface PerfilRow {
  ide_perf: number;
  ide_rol: number;
  nombre_rol?: string | null;
  nombre_perf: string;
  descripcion_perf: string;
  usua_ingre?: string;
  fecha_ingre?: Date;
  usua_actua?: string;
  fecha_actua?: Date;
}

export class PerfilesMapper {
  static toRow(perfil: PerfilEntity): PerfilRow {
    return {
      ide_perf: perfil.idePerf,
      ide_rol: perfil.ideRol,
      nombre_rol: perfil.rol?.nombreRol ?? null,
      nombre_perf: perfil.nombrePerf,
      descripcion_perf: perfil.descripcionPerf,
      usua_ingre: perfil.usuaIngre,
      fecha_ingre: perfil.fechaIngre,
      usua_actua: perfil.usuaActua,
      fecha_actua: perfil.fechaActua,
    };
  }

  static toRows(perfiles: PerfilEntity[]): PerfilRow[] {
    return perfiles.map((perfil) => this.toRow(perfil));
  }
}
