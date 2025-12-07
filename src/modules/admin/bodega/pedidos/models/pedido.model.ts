export interface IPedido {
  ide_pedi?: number;
  ide_empr: number;
  fecha_pedi: string;
  fecha_entr_pedi: string;
  cantidad_total_pedi: number;
  total_pedi: number;
  estado_pedi: 'progreso' | 'completado' | 'incompleto';
  motivo_pedi: 'peticion' | 'devolucion';
  observacion_pedi: string;

  usua_ingre?: string;
  fecha_ingre?: string;
  usua_actua?: string;
  fecha_actua?: string;
}
