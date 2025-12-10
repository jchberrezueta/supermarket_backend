
export enum EnumEstadosEmpresa {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo'
}

export interface IEmpresaResult {
    ide_empr: number;
    nombre_empr: string;
    responsable_empr: string;
    descripcion_empr: string;
    direccion_empr: string;
    telefono_empr: string;
    email_empr: string;
    fecha_contrato_empr: string;
    estado_empr: EnumEstadosEmpresa;
}
