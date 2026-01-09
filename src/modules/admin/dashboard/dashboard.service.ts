import { DatabaseService } from '@database';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
    constructor(private readonly db: DatabaseService) {}

    async getEstadisticas() {
        const query = `
            SELECT json_build_object(
                'totalVentas', (SELECT COALESCE(SUM(total_vent), 0) FROM venta WHERE DATE(fecha_vent) = CURRENT_DATE),
                'ventasHoy', (SELECT COUNT(*) FROM venta WHERE DATE(fecha_vent) = CURRENT_DATE),
                'totalProductos', (SELECT COUNT(*) FROM producto WHERE estado_prod = 'activo'),
                'totalClientes', (SELECT COUNT(*) FROM cliente),
                'totalEmpleados', (SELECT COUNT(*) FROM empleado),
                'totalProveedores', (SELECT COUNT(*) FROM proveedor),
                'pedidosPendientes', (SELECT COUNT(*) FROM pedido WHERE estado_pedi = 'progreso'),
                'entregasPendientes', (SELECT COUNT(*) FROM entrega WHERE estado_entr = 'incompleto'),
                'ventasMes', (SELECT COALESCE(SUM(total_vent), 0) FROM venta WHERE EXTRACT(MONTH FROM fecha_vent) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM fecha_vent) = EXTRACT(YEAR FROM CURRENT_DATE)),
                'productosStockBajo', (SELECT COUNT(*) FROM producto WHERE stock_prod < 10 AND estado_prod = 'activo')
            ) as data
        `;
        const result = await this.db.executeQuery(query);
        return result[0].data;
    }

    async getVentasMensuales() {
        const query = `
            SELECT json_build_object(
                'data', COALESCE(json_agg(
                    json_build_object(
                        'mes', mes,
                        'total', total
                    ) ORDER BY num_mes
                ), '[]'::json)
            )
            FROM (
                SELECT 
                    TO_CHAR(fecha_vent, 'Mon') as mes,
                    EXTRACT(MONTH FROM fecha_vent) as num_mes,
                    COALESCE(SUM(total_vent), 0) as total
                FROM venta
                WHERE fecha_vent >= CURRENT_DATE - INTERVAL '6 months'
                GROUP BY TO_CHAR(fecha_vent, 'Mon'), EXTRACT(MONTH FROM fecha_vent)
            ) t
        `;
        const result = await this.db.executeQuery(query);
        return result[0].json_build_object.data;
    }

    async getProductosTop() {
        const query = `
            SELECT json_build_object(
                'data', COALESCE(json_agg(
                    json_build_object(
                        'nombre', nombre,
                        'cantidad', cantidad
                    )
                ), '[]'::json)
            )
            FROM (
                SELECT 
                    p.nombre_prod as nombre,
                    COALESCE(SUM(dv.cantidad_prod), 0) as cantidad
                FROM producto p
                LEFT JOIN detalle_venta dv ON p.ide_prod = dv.ide_prod
                GROUP BY p.ide_prod, p.nombre_prod
                ORDER BY cantidad DESC
                LIMIT 5
            ) t
        `;
        const result = await this.db.executeQuery(query);
        return result[0].json_build_object.data;
    }

    async getVentasPorCategoria() {
        const query = `
            SELECT json_build_object(
                'data', COALESCE(json_agg(
                    json_build_object(
                        'categoria', categoria,
                        'total', total
                    )
                ), '[]'::json)
            )
            FROM (
                SELECT 
                    c.nombre_cate as categoria,
                    COALESCE(SUM(dv.total_prod), 0) as total
                FROM categoria c
                LEFT JOIN producto p ON c.ide_cate = p.ide_cate
                LEFT JOIN detalle_venta dv ON p.ide_prod = dv.ide_prod
                GROUP BY c.ide_cate, c.nombre_cate
                ORDER BY total DESC
                LIMIT 6
            ) t
        `;
        const result = await this.db.executeQuery(query);
        return result[0].json_build_object.data;
    }

    async getUltimasVentas() {
        const query = `
            SELECT json_build_object(
                'data', COALESCE(json_agg(
                    json_build_object(
                        'id', ide_vent,
                        'fecha', TO_CHAR(fecha_vent, 'DD/MM/YYYY HH24:MI'),
                        'total', total_vent,
                        'estado', estado_vent
                    )
                ), '[]'::json)
            )
            FROM (
                SELECT ide_vent, fecha_vent, total_vent, estado_vent
                FROM venta
                ORDER BY fecha_vent DESC
                LIMIT 5
            ) t
        `;
        const result = await this.db.executeQuery(query);
        return result[0].json_build_object.data;
    }

    async getPedidosRecientes() {
        const query = `
            SELECT json_build_object(
                'data', COALESCE(json_agg(
                    json_build_object(
                        'id', p.ide_pedi,
                        'empresa', e.nombre_empr,
                        'fecha', TO_CHAR(p.fecha_pedi, 'DD/MM/YYYY'),
                        'total', p.total_pedi,
                        'estado', p.estado_pedi
                    )
                ), '[]'::json)
            )
            FROM (
                SELECT ide_pedi, ide_empr, fecha_pedi, total_pedi, estado_pedi
                FROM pedido
                ORDER BY fecha_pedi DESC
                LIMIT 5
            ) p
            LEFT JOIN empresa e ON p.ide_empr = e.ide_empr
        `;
        const result = await this.db.executeQuery(query);
        return result[0].json_build_object.data;
    }
}
