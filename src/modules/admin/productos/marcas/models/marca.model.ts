export interface IMarca {
  ide_marc: number;
  nombre_marc: string;
  pais_origen_marc: string;
  calidad_marc: number; // INTEGER con CHECK 1-10 → number
  descripcion_marc: string;

  usua_ingre?: string | null;
  fecha_ingre?: Date | null;
  usua_actua?: string | null;
  fecha_actua?: Date | null;
}