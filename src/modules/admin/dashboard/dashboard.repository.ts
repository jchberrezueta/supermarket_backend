import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export interface DashboardEstadisticas {
  totalVentas: number;
  ventasHoy: number;
  totalProductos: number;
  totalClientes: number;
  totalEmpleados: number;
  totalProveedores: number;
  pedidosPendientes: number;
  entregasPendientes: number;
  ventasMes: number;
  productosStockBajo: number;
}

export interface VentaMensualRow {
  mes: string;
  total: number;
}

export interface ProductoTopRow {
  nombre: string;
  cantidad: number;
}

export interface VentaPorCategoriaRow {
  categoria: string;
  total: number;
}

export interface UltimaVentaRow {
  id: number;
  fecha: string;
  total: number;
  estado: string;
}

export interface PedidoRecienteRow {
  id: number;
  empresa: string | null;
  fecha: string;
  total: number;
  estado: string;
}

@Injectable()
export class DashboardRepository {
  private readonly STOCK_BAJO_LIMITE = 10;

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async getEstadisticas(): Promise<DashboardEstadisticas> {
    const query = `
      SELECT
        (
          SELECT COALESCE(SUM(total_vent), 0)
          FROM venta
          WHERE DATE(fecha_vent) = CURRENT_DATE
            AND estado_vent = 'completado'
        ) AS "totalVentas",
        (
          SELECT COUNT(*)
          FROM venta
          WHERE DATE(fecha_vent) = CURRENT_DATE
            AND estado_vent = 'completado'
        ) AS "ventasHoy",
        (
          SELECT COUNT(*)
          FROM producto
          WHERE estado_prod = 'activo'
        ) AS "totalProductos",
        (
          SELECT COUNT(*)
          FROM cliente
        ) AS "totalClientes",
        (
          SELECT COUNT(*)
          FROM empleado
          WHERE estado_empl = 'activo'
        ) AS "totalEmpleados",
        (
          SELECT COUNT(*)
          FROM proveedor
        ) AS "totalProveedores",
        (
          SELECT COUNT(*)
          FROM pedido
          WHERE estado_pedi IN ('progreso', 'emitido', 'incompleto')
        ) AS "pedidosPendientes",
        (
          SELECT COUNT(*)
          FROM entrega
          WHERE estado_entr = 'incompleto'
        ) AS "entregasPendientes",
        (
          SELECT COALESCE(SUM(total_vent), 0)
          FROM venta
          WHERE estado_vent = 'completado'
            AND fecha_vent >= DATE_TRUNC('month', CURRENT_DATE)
            AND fecha_vent < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
        ) AS "ventasMes",
        (
          SELECT COUNT(*)
          FROM producto
          WHERE estado_prod = 'activo'
            AND stock_prod < $1
        ) AS "productosStockBajo"
    `;

    const result = await this.dataSource.query(query, [this.STOCK_BAJO_LIMITE]);

    const row = result?.[0] ?? {};

    return {
      totalVentas: this.toNumber(row.totalVentas),
      ventasHoy: this.toNumber(row.ventasHoy),
      totalProductos: this.toNumber(row.totalProductos),
      totalClientes: this.toNumber(row.totalClientes),
      totalEmpleados: this.toNumber(row.totalEmpleados),
      totalProveedores: this.toNumber(row.totalProveedores),
      pedidosPendientes: this.toNumber(row.pedidosPendientes),
      entregasPendientes: this.toNumber(row.entregasPendientes),
      ventasMes: this.toNumber(row.ventasMes),
      productosStockBajo: this.toNumber(row.productosStockBajo),
    };
  }

  async getVentasMensuales(): Promise<VentaMensualRow[]> {
    const query = `
      WITH meses AS (
        SELECT generate_series(
          DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '5 months',
          DATE_TRUNC('month', CURRENT_DATE),
          INTERVAL '1 month'
        ) AS mes_inicio
      )
      SELECT
        TO_CHAR(meses.mes_inicio, 'Mon') AS "mes",
        COALESCE(SUM(venta.total_vent), 0) AS "total"
      FROM meses
      LEFT JOIN venta
        ON DATE_TRUNC('month', venta.fecha_vent) = meses.mes_inicio
        AND venta.estado_vent = 'completado'
      GROUP BY meses.mes_inicio
      ORDER BY meses.mes_inicio ASC
    `;

    const result = await this.dataSource.query(query);

    return result.map((row) => ({
      mes: row.mes,
      total: this.toNumber(row.total),
    }));
  }

  async getProductosTop(): Promise<ProductoTopRow[]> {
    const query = `
      SELECT 
        producto.nombre_prod AS "nombre",
        COALESCE(SUM(detalle.cantidad_prod), 0) AS "cantidad"
      FROM detalle_venta detalle
      INNER JOIN venta
        ON venta.ide_vent = detalle.ide_vent
        AND venta.estado_vent = 'completado'
      INNER JOIN producto
        ON producto.ide_prod = detalle.ide_prod
      GROUP BY producto.ide_prod, producto.nombre_prod
      ORDER BY "cantidad" DESC
      LIMIT 5
    `;

    const result = await this.dataSource.query(query);

    return result.map((row) => ({
      nombre: row.nombre,
      cantidad: this.toNumber(row.cantidad),
    }));
  }

  async getVentasPorCategoria(): Promise<VentaPorCategoriaRow[]> {
    const query = `
      SELECT 
        categoria.nombre_cate AS "categoria",
        COALESCE(SUM(detalle.total_prod), 0) AS "total"
      FROM detalle_venta detalle
      INNER JOIN venta
        ON venta.ide_vent = detalle.ide_vent
        AND venta.estado_vent = 'completado'
      INNER JOIN producto
        ON producto.ide_prod = detalle.ide_prod
      INNER JOIN categoria
        ON categoria.ide_cate = producto.ide_cate
      GROUP BY categoria.ide_cate, categoria.nombre_cate
      ORDER BY "total" DESC
      LIMIT 6
    `;

    const result = await this.dataSource.query(query);

    return result.map((row) => ({
      categoria: row.categoria,
      total: this.toNumber(row.total),
    }));
  }

  async getUltimasVentas(): Promise<UltimaVentaRow[]> {
    const query = `
      SELECT
        ide_vent AS "id",
        TO_CHAR(fecha_vent, 'DD/MM/YYYY HH24:MI') AS "fecha",
        total_vent AS "total",
        estado_vent AS "estado"
      FROM venta
      ORDER BY fecha_vent DESC, ide_vent DESC
      LIMIT 5
    `;

    const result = await this.dataSource.query(query);

    return result.map((row) => ({
      id: this.toNumber(row.id),
      fecha: row.fecha,
      total: this.toNumber(row.total),
      estado: row.estado,
    }));
  }

  async getPedidosRecientes(): Promise<PedidoRecienteRow[]> {
    const query = `
      SELECT
        pedido.ide_pedi AS "id",
        empresa.nombre_empr AS "empresa",
        TO_CHAR(pedido.fecha_pedi, 'DD/MM/YYYY') AS "fecha",
        pedido.total_pedi AS "total",
        pedido.estado_pedi AS "estado"
      FROM pedido
      LEFT JOIN empresa
        ON empresa.ide_empr = pedido.ide_empr
      ORDER BY pedido.fecha_pedi DESC, pedido.ide_pedi DESC
      LIMIT 5
    `;

    const result = await this.dataSource.query(query);

    return result.map((row) => ({
      id: this.toNumber(row.id),
      empresa: row.empresa ?? null,
      fecha: row.fecha,
      total: this.toNumber(row.total),
      estado: row.estado,
    }));
  }

  private toNumber(value: unknown): number {
    const numericValue = Number(value ?? 0);

    if (Number.isNaN(numericValue)) {
      return 0;
    }

    return Number(numericValue.toFixed(2));
  }
}
