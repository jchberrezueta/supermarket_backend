import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '@database';
import { CreateMetodoPagoDto, UpdateMetodoPagoDto } from './dto';

/**
 * Servicio para gestionar los métodos de pago de los clientes.
 * Soporta tarjetas de crédito/débito y PayPal.
 */
@Injectable()
export class MetodosPagoService {

    constructor(private readonly db: DatabaseService) {}

    /**
     * Crear un nuevo método de pago
     */
    async crearMetodoPago(body: CreateMetodoPagoDto) {
        const params = [
            body.ideClie,
            body.tipoPago,
            body.nombreTitular,
            body.numeroTarjetaMasked || null,
            body.marcaTarjeta || null,
            body.fechaExpiracion || null,
            body.emailPaypal || null,
            body.esPredeterminado || 'no',
            body.alias || null,
            body.usuaIngre || 'mobile'
        ];

        try {
            const result = await this.db.executeFunctionWrite('fn_insertar_metodo_pago_cliente', params);

            if (!result || result.p_result !== 1) {
                throw new BadRequestException(result?.p_response || 'Error al crear el método de pago');
            }

            return {
                success: true,
                message: 'Método de pago registrado correctamente',
                ideMetoPago: result.p_id
            };
        } catch (error) {
            throw new BadRequestException(`Error de BD: ${error.message}`);
        }
    }

    /**
     * Listar métodos de pago activos del cliente
     */
    async listarMetodosPago(idCliente: number) {
        if (!idCliente) return [];

        const query = `
            SELECT ide_meto_pago, ide_clie, tipo_pago, nombre_titular,
                   numero_tarjeta_masked, marca_tarjeta, fecha_expiracion,
                   email_paypal, es_predeterminado, alias, estado, fecha_ingre
            FROM metodo_pago_cliente 
            WHERE ide_clie = $1 AND estado = 'activo'
            ORDER BY es_predeterminado DESC, fecha_ingre DESC
        `;
        
        const result = await this.db.executeQuery(query, [idCliente]);
        return (result || []).map((m: any) => this.mapearMetodoPagoACamelCase(m));
    }

    /**
     * Obtener método de pago por ID (verifica que pertenezca al cliente)
     */
    async obtenerMetodoPago(ideMetoPago: number, idCliente: number) {
        const query = `
            SELECT * FROM metodo_pago_cliente 
            WHERE ide_meto_pago = $1 AND ide_clie = $2 AND estado = 'activo'
        `;
        
        const result = await this.db.executeQuery(query, [ideMetoPago, idCliente]);
        
        if (!result?.length) {
            throw new NotFoundException('Método de pago no encontrado');
        }

        return this.mapearMetodoPagoACamelCase(result[0]);
    }

    /**
     * Actualizar método de pago
     */
    async actualizarMetodoPago(body: UpdateMetodoPagoDto) {
        const params = [
            body.ideMetoPago,
            body.nombreTitular || null,
            body.fechaExpiracion || null,
            body.esPredeterminado || null,
            body.alias || null,
            body.usuaActua || 'mobile'
        ];

        try {
            const result = await this.db.executeFunctionWrite('fn_actualizar_metodo_pago_cliente', params);

            if (!result || result.p_result !== 1) {
                throw new BadRequestException(result?.p_response || 'Error al actualizar el método de pago');
            }

            return {
                success: true,
                message: 'Método de pago actualizado correctamente'
            };
        } catch (error) {
            throw new BadRequestException(`Error de BD: ${error.message}`);
        }
    }

    /**
     * Eliminar método de pago (soft delete)
     */
    async eliminarMetodoPago(ideMetoPago: number, usuaActua: string = 'mobile') {
        const params = [ideMetoPago, usuaActua];

        try {
            const result = await this.db.executeFunctionWrite('fn_eliminar_metodo_pago_cliente', params);

            if (!result || result.p_result !== 1) {
                throw new BadRequestException(result?.p_response || 'Error al eliminar el método de pago');
            }

            return {
                success: true,
                message: 'Método de pago eliminado correctamente'
            };
        } catch (error) {
            throw new BadRequestException(`Error de BD: ${error.message}`);
        }
    }

    /**
     * Establecer un método como predeterminado (quita el flag de los demás)
     */
    async establecerPredeterminado(ideMetoPago: number, idCliente: number) {
        // Quitar predeterminado de todos los métodos del cliente
        await this.db.executeQuery(
            `UPDATE metodo_pago_cliente 
             SET es_predeterminado = 'no', fecha_actua = CURRENT_TIMESTAMP
             WHERE ide_clie = $1`,
            [idCliente]
        );

        // Establecer el nuevo predeterminado
        await this.db.executeQuery(
            `UPDATE metodo_pago_cliente 
             SET es_predeterminado = 'si', fecha_actua = CURRENT_TIMESTAMP
             WHERE ide_meto_pago = $1 AND ide_clie = $2`,
            [ideMetoPago, idCliente]
        );

        return { success: true, message: 'Método de pago establecido como predeterminado' };
    }

    /**
     * Mapear de snake_case a camelCase
     */
    private mapearMetodoPagoACamelCase(m: any) {
        return {
            ideMetoPago: m.ide_meto_pago,
            ideClie: m.ide_clie,
            tipoPago: m.tipo_pago,
            nombreTitular: m.nombre_titular,
            numeroTarjetaMasked: m.numero_tarjeta_masked,
            marcaTarjeta: m.marca_tarjeta,
            fechaExpiracion: m.fecha_expiracion,
            emailPaypal: m.email_paypal,
            esPredeterminado: m.es_predeterminado,
            alias: m.alias,
            estado: m.estado,
            fechaIngre: m.fecha_ingre
        };
    }
}
