export enum EnumEstadoDetalleEntregaLote {
  REGISTRADO = 'registrado',
  CONFIRMADO = 'confirmado',
  ANULADO = 'anulado',
}

export interface IDetalleEntregaLote {
  ideDetaEntrLote: number;
  ideDetaEntr: number;
  ideLote?: number | null;
  fechaCaducidadLote: string;
  cantidadLote: number;
  estadoDetaEntrLote: EnumEstadoDetalleEntregaLote;
}

export interface IDetalleEntregaLoteResult {
  ide_deta_entr_lote: number;
  ide_deta_entr: number;
  ide_lote: number | null;
  fecha_caducidad_lote: string;
  cantidad_lote: number;
  estado_deta_entr_lote: EnumEstadoDetalleEntregaLote;
}

export interface IFiltroDetalleEntregaLote {
  ideDetaEntrLote?: number;
  ideDetaEntr?: number;
  ideLote?: number;
  fechaCaducidadDesde?: string;
  fechaCaducidadHasta?: string;
  estadoDetaEntrLote?: EnumEstadoDetalleEntregaLote;
}
