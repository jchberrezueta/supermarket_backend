export interface IRol {
  ide_rol: number;
  nombre_rol: string;
  descripcion_rol: string;

  usua_ingre?: string | null;
  fecha_ingre?: string | null;
  usua_actua?: string | null;
  fecha_actua?: string | null;
}
