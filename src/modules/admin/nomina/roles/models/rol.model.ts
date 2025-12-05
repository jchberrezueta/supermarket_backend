export interface IRol {
  ide_rol: number;
  nombre_rol: string;
  descripcion_rol: string;

  usua_ingre?: string | null;
  fecha_ingre?: Date | null;
  usua_actua?: string | null;
  fecha_actua?: Date | null;
}
