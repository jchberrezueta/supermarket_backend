export interface IPedido {
  ide_pedi: number;
  ide_empr: number;
  fecha_pedi: Date;
  fecha_entr_pedi: Date;
  cantidad_total_pedi: number;
  total_pedi: number;
  estado_pedi: 'progreso' | 'completado' | 'incompleto';
  motivo_pedi: 'peticion' | 'devolucion';
  observacion_pedi: string;
  
  usua_ingre?: string | null;
  fecha_ingre?: Date | null;
  usua_actua?: string | null;
  fecha_actua?: Date | null;
}
