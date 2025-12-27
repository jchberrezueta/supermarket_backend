import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
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
        const cabecera = body.cabeceraVenta;
        
        // Construir array de parámetros para fn_insertar_venta
        // Orden: p_ide_empl, p_ide_clie, p_num_factura_vent, p_fecha_vent, 
        //        p_cantidad_vent, p_sub_total_vent, p_dcto_socio_vent, 
        //        p_dcto_edad_vent, p_total_vent, p_estado_vent, p_usua_ingre
        const cabeceraParams = [
            null,                               // p_ide_empl - ventas móviles no requieren empleado
            cabecera.ideClie,                   // p_ide_clie
            cabecera.numFacturaVent,            // p_num_factura_vent
            cabecera.fechaVent,                 // p_fecha_vent
            cabecera.cantidadVent,              // p_cantidad_vent
            cabecera.subTotalVent,              // p_sub_total_vent
            cabecera.dctoSocioVent || 0,        // p_dcto_socio_vent
            cabecera.dctoEdadVent || 0,         // p_dcto_edad_vent
            cabecera.totalVent,                 // p_total_vent
            'completado',                       // p_estado_vent
            cabecera.usuaIngre || 'mobile'      // p_usua_ingre
        ];

        console.log('=== Parámetros cabecera venta ===', cabeceraParams);

        // Insertar cabecera de venta
        let result;
        try {
            result = await this.db.executeFunctionWrite(
                `fn_insertar_${this.fnName}`,
                cabeceraParams
            );
            console.log('=== Resultado fn_insertar_venta ===', result);
        } catch (dbError) {
            console.error('=== Error BD al insertar venta ===', dbError);
            throw new BadRequestException(`Error de BD: ${dbError.message}`);
        }

        if (!result || result.p_result !== 1) {
            console.error('=== fn_insertar_venta falló ===', result);
            throw new BadRequestException(result?.p_response || 'Error al crear la venta');
        }

        const ideVenta = result.p_id;

        // Insertar detalles de venta
        for (const detalle of body.detalleVenta) {
            // Construir array de parámetros para fn_insertar_detalle_venta
            // Orden: p_ide_vent, p_ide_prod, p_cantidad_prod, p_precio_unitario_prod, 
            //        p_subtotal_prod, p_iva_prod, p_dcto_promo_prod, p_total_prod
            const detalleParams = [
                ideVenta,                           // p_ide_vent
                detalle.ideProd,                    // p_ide_prod
                detalle.cantidadProd,               // p_cantidad_prod
                detalle.precioUnitarioProd,         // p_precio_unitario_prod
                detalle.subtotalProd,               // p_subtotal_prod
                detalle.ivaProd || 0,               // p_iva_prod
                detalle.dctoPromoProd || 0,         // p_dcto_promo_prod
                detalle.totalProd                   // p_total_prod
            ];
            
            await this.db.executeFunctionWrite(`fn_insertar_${this.fnNameDetalle}`, detalleParams);
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
                v.dcto_socio_vent,
                v.dcto_edad_vent,
                v.total_vent,
                v.estado_vent,
                v.fecha_ingre
            FROM venta v
            WHERE v.ide_clie = ${idCliente}
            ORDER BY v.fecha_vent DESC
        `;
        const result = await this.db.executeQuery(query);
        
        // Mapear a camelCase
        return (result || []).map((v: any) => this.mapearVentaACamelCase(v));
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
            throw new NotFoundException('Venta no encontrada');
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
                dv.dcto_promo_prod,
                dv.iva_prod,
                dv.total_prod,
                p.nombre_prod,
                p.imagen_prod
            FROM detalle_venta dv
            INNER JOIN producto p ON p.ide_prod = dv.ide_prod
            WHERE dv.ide_vent = ${idVenta}
        `;
        const detalles = await this.db.executeQuery(detalleQuery);

        return {
            venta: this.mapearVentaACamelCase(venta[0]),
            detalles: (detalles || []).map((d: any) => this.mapearDetalleVentaACamelCase(d))
        };
    }

    /**
     * Mapear venta de snake_case a camelCase
     */
    private mapearVentaACamelCase(v: any) {
        return {
            ideVent: v.ide_vent,
            ideClie: v.ide_clie,
            ideEmpl: v.ide_empl,
            numFacturaVent: v.num_factura_vent,
            fechaVent: v.fecha_vent,
            cantidadVent: Number(v.cantidad_vent) || 0,
            subTotalVent: Number(v.sub_total_vent) || 0,
            dctoSocioVent: Number(v.dcto_socio_vent) || 0,
            dctoEdadVent: Number(v.dcto_edad_vent) || 0,
            totalVent: Number(v.total_vent) || 0,
            estadoVent: v.estado_vent,
            fechaIngre: v.fecha_ingre
        };
    }

    /**
     * Mapear detalle venta de snake_case a camelCase
     */
    private mapearDetalleVentaACamelCase(d: any) {
        return {
            ideDetaVent: d.ide_deta_vent,
            ideVent: d.ide_vent,
            ideProd: d.ide_prod,
            cantidadProd: Number(d.cantidad_prod) || 0,
            precioUnitarioProd: Number(d.precio_unitario_prod) || 0,
            subtotalProd: Number(d.subtotal_prod) || 0,
            dctoPromoProd: Number(d.dcto_promo_prod) || 0,
            ivaProd: Number(d.iva_prod) || 0,
            totalProd: Number(d.total_prod) || 0,
            nombreProd: d.nombre_prod,
            imagenProd: d.imagen_prod
        };
    }
}
