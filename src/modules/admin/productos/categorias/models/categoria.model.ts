export interface ICategoria {
  ide_cate: number;
  nombre_cate: string;
  descripcion_cate: string;

  usua_ingre?: string | null;
  fecha_ingre?: string | null;
  usua_actua?: string | null;
  fecha_actua?: string | null;
}