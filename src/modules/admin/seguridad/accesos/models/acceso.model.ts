export interface IAccesoUsuario {
  ide_acce: number;
  ide_cuen: number;
  navegador_acce: string;
  fecha_acce?: Date | null;
  num_int_fall_acce: number;
  ip_acce: string;
  latitud_acce?: number | null;
  longitud_acce?: number | null;
}
