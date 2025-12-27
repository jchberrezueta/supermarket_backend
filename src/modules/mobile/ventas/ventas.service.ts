import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@database';
import { CreateVentaClienteDto } from './dto';

@Injectable()
export class MobileVentasService {

    private fnName: string = 'venta';
    private fnNameDetalle: string = 'detalle_venta';

    constructor(private readonly db: DatabaseService) {}

    /**
     * Crear una nueva venta desde la app móvil
     */
    async crearVenta(body: CreateVentaClienteDto) {
        // Insertar cabecera de venta
        const result = await this.db.executeFunctionWrite(
            `fn_insertar_${this.fnName}`,
            body.cabeceraVenta.toArray()
        );

        if (!result || result.p_result !== 1) {
            throw new Error('Error al crear la venta');
        }

        const ideVenta = result.p_id;

        // Insertar detalles de venta
        for (const detalle of body.detalleVenta) {
            const dataDetalle = detalle.toArray();
            dataDetalle.unshift(ideVenta); // Agregar ID de venta al inicio
            await this.db.executeFunctionWrite(`fn_insertar_${this.fnNameDetalle}`, dataDetalle);
        }

        return {
            success: true,
            message: 'Venta registrada correctamente',
            ideVenta: ideVenta
        };
    }

    /**
     * Obtener historial de compras del cliente
     */
    async obtenerHistorialCliente(idCliente: number) {
        const query = `
            SELECT 
                v.ide_vent,
                v.ide_clie,
                v.num_factura_vent,
                v.fecha_vent,
                v.cantidad_vent,
                v.sub_total_vent,
                v.dcto_vent,
                v.total_vent,
                v.estado_vent,
                v.fecha_ingre
            FROM venta v
            WHERE v.ide_clie = ${idCliente}
            ORDER BY v.fecha_vent DESC
        `;
        return this.db.executeQuery(query);
    }

    /**
     * Obtener detalle de una venta específica
     */
    async obtenerDetalleVenta(idVenta: number, idCliente: number) {
        // Primero verificar que la venta pertenece al cliente
        const ventaQuery = `
            SELECT * FROM venta 
            WHERE ide_vent = ${idVenta} AND ide_clie = ${idCliente}
        `;
        const venta = await this.db.executeQuery(ventaQuery);

        if (!venta || venta.length === 0) {
            throw new Error('Venta no encontrada');
        }

        // Obtener detalles de la venta
        const detalleQuery = `
            SELECT 
                dv.ide_deta_vent,
                dv.ide_vent,
                dv.ide_prod,
                dv.cantidad_prod,
                dv.precio_unitario_prod,
                dv.subtotal_prod,
                dv.dcto_promo,
                dv.iva_prod,
                p.nombre_prod,
                p.imagen_prod
            FROM detalle_venta dv
            INNER JOIN producto p ON p.ide_prod = dv.ide_prod
            WHERE dv.ide_vent = ${idVenta}
        `;
        const detalles = await this.db.executeQuery(detalleQuery);

        return {
            venta: venta[0],
            detalles: detalles
        };
    }
}
