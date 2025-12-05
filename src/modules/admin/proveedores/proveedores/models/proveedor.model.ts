export interface IProveedor {
    ide_prov: number;
    ide_empr: number;
    cedula_prov: string;
    fecha_nacimiento_prov: Date;
    edad_prov: number;
    telefono_prov: string;
	email_prov: string;
	primer_nombre_prov: string;
	apellido_paterno_prov: string;
    segundo_nombre_prov: string;
    apellido_materno_prov: string;

    usua_ingre?: string | null;
    fecha_ingre?: Date | null;
    usua_actua?: string | null;
    fecha_actua?: Date | null;
}