export interface IVenta {
  ide_vent: number;
  ide_empl: number;
  ide_clie: number;
  num_factura_vent: string;
  fecha_vent: Date;
  cantidad_vent: number;
  sub_total_vent: number;
  total_vent: number;
  dcto_vent: number;
  estado_vent: 'completado' | 'cancelado' | 'devuelto';

  usua_ingre?: string | null;
  fecha_ingre?: Date | null;
  usua_actua?: string | null;
  fecha_actua?: Date | null;
}
