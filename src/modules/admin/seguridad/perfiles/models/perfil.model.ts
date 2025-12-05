export interface IPerfil {
  ide_perf: number;
  ide_rol: number;
  nombre_perf: string;
  descripcion_perf: string;

  usua_ingre?: string | null;
  fecha_ingre?: Date | null;
  usua_actua?: string | null;
  fecha_actua?: Date | null;
}
