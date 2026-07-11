export enum EnumTipoMovimientoInventario {
  ENTRADA_ENTREGA = 'entrada_entrega',
  SALIDA_VENTA = 'salida_venta',
  SALIDA_DEVOLUCION_PROVEEDOR = 'salida_devolucion_proveedor',
  ENTRADA_CANJE_CADUCIDAD = 'entrada_canje_caducidad',
  ANULACION_VENTA = 'anulacion_venta',
  ANULACION_ENTREGA = 'anulacion_entrega',
  AJUSTE_ENTRADA = 'ajuste_entrada',
  AJUSTE_SALIDA = 'ajuste_salida',
  CORRECCION_LOTE = 'correccion_lote',
}

export interface IMovimientoInventario {
  ideMovi: number;
  ideProd: number;
  ideLote?: number | null;
  ideDetaEntr?: number | null;
  ideDetaVent?: number | null;
  tipoMovi: EnumTipoMovimientoInventario;
  cantidadMovi: number;
  stockProdAnterior?: number | null;
  stockProdPosterior?: number | null;
  stockLoteAnterior?: number | null;
  stockLotePosterior?: number | null;
  observacionMovi?: string | null;
}

export interface IMovimientoInventarioResult {
  ide_movi: number;
  ide_prod: number;
  ide_lote: number | null;
  ide_deta_entr: number | null;
  ide_deta_vent: number | null;
  tipo_movi: EnumTipoMovimientoInventario;
  cantidad_movi: number;
  stock_prod_anterior: number | null;
  stock_prod_posterior: number | null;
  stock_lote_anterior: number | null;
  stock_lote_posterior: number | null;
  observacion_movi: string | null;
}

export interface IFiltroMovimientoInventario {
  ideProd?: number;
  ideLote?: number;
  ideDetaEntr?: number;
  ideDetaVent?: number;
  tipoMovi?: EnumTipoMovimientoInventario;
  fechaDesde?: string;
  fechaHasta?: string;
}
