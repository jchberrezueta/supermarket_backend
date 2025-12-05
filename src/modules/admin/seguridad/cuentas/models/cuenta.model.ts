export interface ICuenta {
  ide_cuen: number;
  ide_empl: number;
  ide_perf: number;
  usuario_cuen: string;
  password_cuen: string;
  estado_cuen: 'activo' | 'inactivo' | 'bloqueado';

  usua_ingre?: string | null;
  fecha_ingre?: Date | null;
  usua_actua?: string | null;
  fecha_actua?: Date | null;
}
