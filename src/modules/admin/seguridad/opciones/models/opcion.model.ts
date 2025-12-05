export interface IOpcion {
  ide_opci: number;
  nombre_opci: string;
  ruta_opci: string;
  activo_opci: 'si' | 'no';
  descripcion_opci: string;

  usua_ingre?: string | null;
  fecha_ingre?: Date | null;
  usua_actua?: string | null;
  fecha_actua?: Date | null;
}
