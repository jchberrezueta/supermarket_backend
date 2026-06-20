import { RolEntity } from '@entities';

export interface RolRow {
  ide_rol: number;
  nombre_rol: string;
  descripcion_rol: string;
  usua_ingre?: string;
  fecha_ingre?: Date;
  usua_actua?: string;
  fecha_actua?: Date;
}

export class RolesMapper {
  static toRow(rol: RolEntity): RolRow {
    return {
      ide_rol: rol.ideRol,
      nombre_rol: rol.nombreRol,
      descripcion_rol: rol.descripcionRol,
      usua_ingre: rol.usuaIngre,
      fecha_ingre: rol.fechaIngre,
      usua_actua: rol.usuaActua,
      fecha_actua: rol.fechaActua,
    };
  }

  static toRows(roles: RolEntity[]): RolRow[] {
    return roles.map((rol) => this.toRow(rol));
  }
}
