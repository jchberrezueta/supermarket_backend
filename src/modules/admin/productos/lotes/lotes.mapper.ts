import { LoteEntity } from '@entities';

export interface LoteRow {
  ide_lote: number;
  ide_prod: number;
  nombre_prod?: string | null;
  fecha_caducidad_lote: string;
  stock_lote: number;
  estado_lote: string;
}

export class LotesMapper {
  static toRow(lote: LoteEntity): LoteRow {
    return {
      ide_lote: lote.ideLote,
      ide_prod: lote.ideProd,
      nombre_prod: lote.producto?.nombreProd ?? null,
      fecha_caducidad_lote: this.formatDate(lote.fechaCaducidadLote),
      stock_lote: lote.stockLote,
      estado_lote: lote.estadoLote,
    };
  }

  static toRows(lotes: LoteEntity[]): LoteRow[] {
    return lotes.map((lote) => this.toRow(lote));
  }

  private static formatDate(value: Date | string): string {
    if (!value) {
      return '';
    }

    const dateText =
      value instanceof Date ? value.toISOString().slice(0, 10) : String(value);

    return dateText.slice(0, 10);
  }
}
