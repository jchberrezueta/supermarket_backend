export interface ICliente {
  ide_clie: number;
  cedula_clie: string;
  fecha_nacimiento_clie: Date;
  edad_clie: number;
  telefono_clie: string;
  primer_nombre_clie: string;
  apellido_paterno_clie: string;
  email_clie: string;
  es_socio: 'si' | 'no';
  es_tercera_edad: 'si' | 'no';
  segundo_nombre_clie?: string | null;
  apellido_materno_clie?: string | null;

  usua_ingre?: string | null;
  fecha_ingre?: Date | null;
  usua_actua?: string | null;
  fecha_actua?: Date | null;
}
