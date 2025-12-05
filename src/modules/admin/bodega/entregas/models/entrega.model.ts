export interface IEntrega {
  ide_entr: number;
  ide_pedi: number;
  ide_prov: number;
  fecha_entr: Date;
  cantidad_total_entr: number;
  total_entr: number;             
  estado_entr: 'completo' | 'incompleto';
  observacion_entr: string;
  
  usua_ingre?: string | null;
  fecha_ingre?: Date | null;
  usua_actua?: string | null;
  fecha_actua?: Date | null;
}