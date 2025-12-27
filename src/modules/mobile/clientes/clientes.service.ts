import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@database';
import { UpdateClienteDto } from './dto';

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

        return result[0];
    }

    /**
     * Actualizar datos del cliente
     */
    async actualizarPerfil(idCliente: number, data: UpdateClienteDto) {
        // Primero obtener los datos actuales del cliente
        const clienteActual = await this.obtenerPerfil(idCliente);
        
        if (!clienteActual) {
            throw new Error('Cliente no encontrado');
        }

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
            throw new Error('Error al actualizar el cliente');
        }

        // Retornar el perfil actualizado
        return this.obtenerPerfil(idCliente);
    }
}
