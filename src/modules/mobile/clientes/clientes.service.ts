import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '@database';
import { UpdateClienteDto, CambiarPasswordDto } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class MobileClientesService {

    constructor(private readonly db: DatabaseService) {}

    /**
     * Obtener perfil completo del cliente autenticado
     */
    async obtenerPerfil(idCliente: number) {
        const query = `
            SELECT 
                c.ide_clie,
                c.cedula_clie,
                c.fecha_nacimiento_clie,
                c.edad_clie,
                c.telefono_clie,
                c.primer_nombre_clie,
                c.segundo_nombre_clie,
                c.apellido_paterno_clie,
                c.apellido_materno_clie,
                c.email_clie,
                c.es_socio,
                c.es_tercera_edad,
                cc.ide_cuen_clie,
                cc.usuario_clie,
                cc.email_clie as email_cuenta,
                cc.estado_clie
            FROM cliente c
            INNER JOIN cuenta_cliente cc ON cc.ide_clie = c.ide_clie
            WHERE c.ide_clie = ${idCliente}
        `;
        const result = await this.db.executeQuery(query);
        
        if (!result || result.length === 0) {
            return null;
        }

        // Mapear a camelCase para el frontend
        const data = result[0];
        return this.mapearClienteACamelCase(data);
    }

    /**
     * Actualizar datos del cliente
     */
    async actualizarPerfil(idCliente: number, data: UpdateClienteDto) {
        // Primero obtener los datos actuales del cliente (en snake_case de BD)
        const queryActual = `
            SELECT * FROM cliente WHERE ide_clie = ${idCliente}
        `;
        const resultActual = await this.db.executeQuery(queryActual);
        
        if (!resultActual || resultActual.length === 0) {
            throw new BadRequestException('Cliente no encontrado');
        }

        const clienteActual = resultActual[0];

        // Calcular edad si se proporciona fecha de nacimiento
        let edadClie = clienteActual.edad_clie;
        if (data.fechaNacimientoClie) {
            const fechaNac = new Date(data.fechaNacimientoClie);
            const hoy = new Date();
            edadClie = hoy.getFullYear() - fechaNac.getFullYear();
            const mes = hoy.getMonth() - fechaNac.getMonth();
            if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
                edadClie--;
            }
        }

        // Preparar parámetros para fn_actualizar_cliente
        const params = [
            idCliente,
            data.cedulaClie ?? clienteActual.cedula_clie,
            data.fechaNacimientoClie ?? clienteActual.fecha_nacimiento_clie,
            edadClie,
            data.telefonoClie ?? clienteActual.telefono_clie,
            data.primerNombreClie ?? clienteActual.primer_nombre_clie,
            data.apellidoPaternoClie ?? clienteActual.apellido_paterno_clie,
            data.emailClie ?? clienteActual.email_clie,
            data.esSocio ?? clienteActual.es_socio,
            data.esTerceraEdad ?? clienteActual.es_tercera_edad,
            data.segundoNombreClie ?? clienteActual.segundo_nombre_clie ?? null,
            data.apellidoMaternoClie ?? clienteActual.apellido_materno_clie ?? null
        ];

        const result = await this.db.executeFunctionWrite('fn_actualizar_cliente', params);

        if (!result || result.p_result !== 1) {
            throw new BadRequestException('Error al actualizar el cliente');
        }

        // Retornar el perfil actualizado
        return this.obtenerPerfil(idCliente);
    }

    /**
     * Cambiar contraseña del cliente
     */
    async cambiarPassword(idCliente: number, data: CambiarPasswordDto) {
        // Obtener cuenta del cliente con su password actual
        const query = `
            SELECT cc.ide_cuen_clie, cc.password_clie
            FROM cuenta_cliente cc
            WHERE cc.ide_clie = ${idCliente}
        `;
        const result = await this.db.executeQuery(query);

        if (!result || result.length === 0) {
            throw new BadRequestException('Cuenta de cliente no encontrada');
        }

        const cuenta = result[0];

        // Verificar contraseña actual
        const passwordValida = await bcrypt.compare(data.passwordActual, cuenta.password_clie);
        if (!passwordValida) {
            throw new UnauthorizedException('La contraseña actual es incorrecta');
        }

        // Hashear nueva contraseña
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(data.passwordNuevo, salt);

        // Actualizar contraseña usando query directo (más simple y seguro)
        const updateQuery = `
            UPDATE cuenta_cliente 
            SET password_clie = '${passwordHash}',
                fecha_actua = CURRENT_TIMESTAMP
            WHERE ide_cuen_clie = ${cuenta.ide_cuen_clie}
        `;
        await this.db.executeQuery(updateQuery);

        return {
            success: true,
            message: 'Contraseña actualizada correctamente'
        };
    }

    /**
     * Mapear campos de snake_case a camelCase
     */
    private mapearClienteACamelCase(data: any) {
        return {
            ideClie: data.ide_clie,
            cedulaClie: data.cedula_clie,
            fechaNacimientoClie: data.fecha_nacimiento_clie,
            edadClie: data.edad_clie,
            telefonoClie: data.telefono_clie,
            primerNombreClie: data.primer_nombre_clie,
            segundoNombreClie: data.segundo_nombre_clie,
            apellidoPaternoClie: data.apellido_paterno_clie,
            apellidoMaternoClie: data.apellido_materno_clie,
            emailClie: data.email_clie,
            esSocio: data.es_socio,
            esTerceraEdad: data.es_tercera_edad,
            ideCuenClie: data.ide_cuen_clie,
            usuarioClie: data.usuario_clie,
            emailCuenta: data.email_cuenta,
            estadoClie: data.estado_clie
        };
    }
}
