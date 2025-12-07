export interface IEmpleado {
  ide_empl: number;
  ide_rol: number;
  cedula_empl: string;
  fecha_nacimiento_empl: string;
  edad_empl: number;
  fecha_inicio_empl: Date;
  primer_nombre_empl: string;
  apellido_paterno_empl: string;
  rmu_empl: number;
  titulo_empl: string;
  estado_empl: 'activo' | 'inactivo';
  segundo_nombre_empl?: string | null;
  apellido_materno_empl?: string | null;
  fecha_termino_empl?: string | null;

  usua_ingre?: string | null;
  fecha_ingre?: string | null;
  usua_actua?: string | null;
  fecha_actua?: string | null;
}
