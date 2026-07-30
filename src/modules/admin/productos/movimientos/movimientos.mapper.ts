import { MovimientoInventarioRawRow } from './movimientos.repository';

export interface MovimientoInventarioRow {
  ide_movi: number;
  fecha_ingre: string;
  ide_prod: number;
  nombre_prod: string;
  ide_lote: number | null;
  fecha_caducidad_lote: string | null;
  tipo_movi: string;
  tipo_movi_label: string;
  cantidad_movi: number;
  stock_prod_anterior: number | null;
  stock_prod_posterior: number | null;
  stock_prod_rango: string;
  stock_lote_anterior: number | null;
  stock_lote_posterior: number | null;
  stock_lote_rango: string;
  documento_origen: string;
  canal_origen: string;
  usua_ingre: string;
  observacion_movi: string | null;
}

export class MovimientosInventarioMapper {
  static toRows(rows: MovimientoInventarioRawRow[]): MovimientoInventarioRow[] {
    return rows.map((row) => this.toRow(row));
  }

  private static toRow(row: MovimientoInventarioRawRow): MovimientoInventarioRow {
    const stockProdAnterior = this.toNullableNumber(row.stock_prod_anterior);
    const stockProdPosterior = this.toNullableNumber(row.stock_prod_posterior);
    const stockLoteAnterior = this.toNullableNumber(row.stock_lote_anterior);
    const stockLotePosterior = this.toNullableNumber(row.stock_lote_posterior);
    const tipoMovi = String(row.tipo_movi ?? '');

    return {
      ide_movi: Number(row.ide_movi),
      fecha_ingre: String(row.fecha_ingre ?? ''),
      ide_prod: Number(row.ide_prod),
      nombre_prod: String(row.nombre_prod ?? ''),
      ide_lote: this.toNullableNumber(row.ide_lote),
      fecha_caducidad_lote: row.fecha_caducidad_lote
        ? String(row.fecha_caducidad_lote)
        : null,
      tipo_movi: tipoMovi,
      tipo_movi_label: this.tipoLabel(tipoMovi),
      cantidad_movi: Number(row.cantidad_movi ?? 0),
      stock_prod_anterior: stockProdAnterior,
      stock_prod_posterior: stockProdPosterior,
      stock_prod_rango: this.stockRango(stockProdAnterior, stockProdPosterior),
      stock_lote_anterior: stockLoteAnterior,
      stock_lote_posterior: stockLotePosterior,
      stock_lote_rango: this.stockRango(stockLoteAnterior, stockLotePosterior),
      documento_origen: String(row.documento_origen ?? 'Sin documento'),
      canal_origen: String(row.canal_origen ?? ''),
      usua_ingre: String(row.usua_ingre ?? ''),
      observacion_movi: row.observacion_movi
        ? String(row.observacion_movi)
        : null,
    };
  }

  static tipoLabel(tipo: string): string {
    const labels: Record<string, string> = {
      entrada_entrega: 'Entrada por entrega',
      salida_venta: 'Salida por venta',
      salida_devolucion_proveedor: 'Salida por devolución al proveedor',
      entrada_canje_caducidad: 'Entrada por canje de caducidad',
      anulacion_venta: 'Anulación de venta',
      anulacion_entrega: 'Anulación de entrega',
      ajuste_entrada: 'Ajuste de entrada',
      ajuste_salida: 'Ajuste de salida',
      correccion_lote: 'Corrección de lote',
    };

    return labels[tipo] ?? tipo;
  }

  private static stockRango(
    anterior: number | null,
    posterior: number | null,
  ): string {
    if (anterior === null && posterior === null) {
      return 'No aplica';
    }

    return `${anterior ?? '-'} → ${posterior ?? '-'}`;
  }

  private static toNullableNumber(value: unknown): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const numberValue = Number(value);

    return Number.isFinite(numberValue) ? numberValue : null;
  }
}
