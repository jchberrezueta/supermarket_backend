export interface IEmpresa {
    id_empr: number;
    nombre_empr: string;
    responsable_empr: string;
    fecha_contrato_empr: Date;
    direccion_empr: string;
    telefono_empr: string;
    email_empr: string;
    estado_empr: string;
    descripcion_empr: string;

    usua_ingre?: string | null;
    fecha_ingre?: Date | null;
    usua_actua?: string | null;
    fecha_actua?: Date | null;
}