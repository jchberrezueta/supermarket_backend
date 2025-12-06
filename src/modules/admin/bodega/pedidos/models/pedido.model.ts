export interface IPedido {
  ide_pedi?: number;
  ide_empr: number;
  fecha_pedi: Date;
  fecha_entr_pedi: Date;
  cantidad_total_pedi: number;
  total_pedi: number;
  estado_pedi: 'progreso' | 'completado' | 'incompleto';
  motivo_pedi: 'peticion' | 'devolucion';
  observacion_pedi: string;

  usua_ingre?: string;
  fecha_ingre?: Date;
  usua_actua?: string;
  fecha_actua?: Date;
}
