import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { FilterMovimientoInventarioDTO } from './dto/filter_movimiento_inventario.dto';

export interface MovimientoInventarioRawRow {
  ide_movi: unknown;
  fecha_ingre: unknown;
  ide_prod: unknown;
  nombre_prod: unknown;
  ide_lote: unknown;
  fecha_caducidad_lote: unknown;
  tipo_movi: unknown;
  cantidad_movi: unknown;
  stock_prod_anterior: unknown;
  stock_prod_posterior: unknown;
  stock_lote_anterior: unknown;
  stock_lote_posterior: unknown;
  documento_origen: unknown;
  canal_origen: unknown;
  usua_ingre: unknown;
  observacion_movi: unknown;
}

@Injectable()
export class MovimientosInventarioRepository {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async listar(
    filtros: FilterMovimientoInventarioDTO = {},
  ): Promise<MovimientoInventarioRawRow[]> {
    const condiciones: string[] = [];
    const parametros: unknown[] = [];

    const addParam = (value: unknown): string => {
      parametros.push(value);
      return `$${parametros.length}`;
    };

    if (filtros.ideMovi !== undefined) {
      condiciones.push(`mi.ide_movi = ${addParam(filtros.ideMovi)}`);
    }

    if (filtros.producto !== undefined) {
      condiciones.push(
        `LOWER(p.nombre_prod) LIKE LOWER(${addParam(`%${filtros.producto}%`)})`,
      );
    }

    if (filtros.ideLote !== undefined) {
      condiciones.push(`mi.ide_lote = ${addParam(filtros.ideLote)}`);
    }

    if (filtros.tipoMovi) {
      condiciones.push(`mi.tipo_movi = ${addParam(filtros.tipoMovi)}`);
    }

    if (filtros.fechaDesde) {
      condiciones.push(
        `mi.fecha_ingre >= ${addParam(filtros.fechaDesde)}::date`,
      );
    }

    if (filtros.fechaHasta) {
      condiciones.push(
        `mi.fecha_ingre < (${addParam(filtros.fechaHasta)}::date + INTERVAL '1 day')`,
      );
    }

    if (filtros.usuaIngre) {
      condiciones.push(
        `LOWER(mi.usua_ingre) LIKE LOWER(${addParam(`%${filtros.usuaIngre}%`)})`,
      );
    }

    const where = condiciones.length
      ? `WHERE ${condiciones.join('\n        AND ')}`
      : '';

    const query = `
      SELECT
        mi.ide_movi,
        TO_CHAR(mi.fecha_ingre, 'DD/MM/YYYY HH24:MI:SS') AS fecha_ingre,
        mi.ide_prod,
        p.nombre_prod,
        mi.ide_lote,
        TO_CHAR(l.fecha_caducidad_lote, 'YYYY-MM-DD') AS fecha_caducidad_lote,
        mi.tipo_movi,
        mi.cantidad_movi,
        mi.stock_prod_anterior,
        mi.stock_prod_posterior,
        mi.stock_lote_anterior,
        mi.stock_lote_posterior,
        CASE
          WHEN mi.ide_deta_entr IS NOT NULL THEN
            CONCAT('Entrega #', e.ide_entr, ' / Pedido #', e.ide_pedi)
          WHEN mi.ide_deta_vent IS NOT NULL THEN
            CONCAT('Venta ', COALESCE(v.num_factura_vent, CONCAT('#', v.ide_vent)))
          ELSE
            'Ajuste de inventario'
        END AS documento_origen,
        CASE
          WHEN mi.ide_deta_entr IS NOT NULL THEN 'bodega'
          WHEN mi.ide_deta_vent IS NOT NULL THEN COALESCE(v.usua_ingre, 'venta')
          ELSE 'ajuste'
        END AS canal_origen,
        mi.usua_ingre,
        mi.observacion_movi
      FROM movimiento_inventario mi
      INNER JOIN producto p
        ON p.ide_prod = mi.ide_prod
      LEFT JOIN lote l
        ON l.ide_lote = mi.ide_lote
      LEFT JOIN detalle_entrega de
        ON de.ide_deta_entr = mi.ide_deta_entr
      LEFT JOIN entrega e
        ON e.ide_entr = de.ide_entr
      LEFT JOIN detalle_venta dv
        ON dv.ide_deta_vent = mi.ide_deta_vent
      LEFT JOIN venta v
        ON v.ide_vent = dv.ide_vent
      ${where}
      ORDER BY mi.fecha_ingre DESC, mi.ide_movi DESC
    `;

    return this.dataSource.query(query, parametros);
  }

  async listarProductos(): Promise<Array<{ value: number; label: string }>> {
    const rows = await this.dataSource.query(`
      SELECT
        ide_prod AS value,
        nombre_prod AS label
      FROM producto
      WHERE estado_prod = 'activo'
      ORDER BY nombre_prod ASC
    `);

    return rows.map((row: { value: unknown; label: unknown }) => ({
      value: Number(row.value),
      label: String(row.label ?? ''),
    }));
  }
}
