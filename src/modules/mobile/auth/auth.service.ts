import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '@database';
import { RegisterClienteDto } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ClienteAuthService {

    constructor(
        private readonly db: DatabaseService,
        private readonly jwtService: JwtService
    ) {}

    /**
     * Valida credenciales del cliente contra cuenta_cliente
     */
    async validateCliente(usuario: string, clave: string) {
        const query = `
            SELECT 
                cc.ide_cuen_clie,
                cc.ide_clie,
                cc.usuario_clie,
                cc.email_clie,
                cc.password_clie,
                cc.estado_clie,
                c.primer_nombre_clie,
                c.segundo_nombre_clie,
                c.apellido_paterno_clie,
                c.apellido_materno_clie,
                c.cedula_clie,
                c.telefono_clie,
                c.email_clie as email_cliente,
                c.es_socio,
                c.es_tercera_edad
            FROM cuenta_cliente cc
            INNER JOIN cliente c ON c.ide_clie = cc.ide_clie
            WHERE cc.usuario_clie = '${usuario}' OR cc.email_clie = '${usuario}'
        `;
        const result = await this.db.executeQuery(query);
        
        if (!result || result.length === 0) {
            return null;
        }

        const user = result[0];
        
        // Verificar contraseña
        const isPasswordValid = await bcrypt.compare(clave, user.password_clie);
        if (!isPasswordValid) {
            return null;
        }

        // Verificar si la cuenta está activa
        if (!user.estado_clie) {
            return null;
        }

        // Retornar datos del usuario sin la contraseña
        const { password_clie, ...userData } = user;
        return userData;
    }

    /**
     * Genera JWT y retorna respuesta de login
     */
    async login(user: any) {
        const payload = {
            sub: user.ide_cuen_clie,
            ide_clie: user.ide_clie,
            username: user.usuario_clie,
            email: user.email_clie,
            tipo: 'cliente'
        };

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.ide_cuen_clie,
                ide_clie: user.ide_clie,
                username: user.usuario_clie,
                email: user.email_clie,
                state: user.estado_clie ? 'activo' : 'inactivo',
                perfil: 'Cliente',
                tipo: 'cliente',
                cliente: {
                    primerNombre: user.primer_nombre_clie,
                    segundoNombre: user.segundo_nombre_clie,
                    apellidoPaterno: user.apellido_paterno_clie,
                    apellidoMaterno: user.apellido_materno_clie,
                    cedula: user.cedula_clie,
                    telefono: user.telefono_clie,
                    email: user.email_cliente,
                    esSocio: user.es_socio,
                    esTerceraEdad: user.es_tercera_edad
                }
            }
        };
    }

    /**
     * Registra nuevo cliente y su cuenta
     */
    async register(data: RegisterClienteDto) {
        // 1. Verificar si ya existe el email o cédula
        const existeCliente = await this.db.executeQuery(
            `SELECT ide_clie FROM cliente WHERE cedula_clie = '${data.cedulaClie}' OR email_clie = '${data.emailClie}'`
        );

        if (existeCliente && existeCliente.length > 0) {
            throw new Error('Ya existe un cliente con esa cédula o email');
        }

        // 2. Verificar si ya existe la cuenta
        const existeCuenta = await this.db.executeQuery(
            `SELECT ide_cuen_clie FROM cuenta_cliente WHERE usuario_clie = '${data.emailClie}' OR email_clie = '${data.emailClie}'`
        );

        if (existeCuenta && existeCuenta.length > 0) {
            throw new Error('Ya existe una cuenta con ese email');
        }

        // 3. Insertar cliente usando la función almacenada
        const clienteResult = await this.db.executeFunctionWrite(
            'fn_insertar_cliente',
            data.toArrayCliente()
        );

        if (!clienteResult || clienteResult.p_result !== 1) {
            throw new Error('Error al registrar el cliente');
        }

        const ideCliente = clienteResult.p_id;

        // 4. Encriptar contraseña
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // 5. Insertar cuenta_cliente usando la función almacenada
        const cuentaResult = await this.db.executeFunctionWrite(
            'fn_insertar_cuenta_cliente',
            [ideCliente, data.emailClie, data.emailClie, hashedPassword, true]
        );

        if (!cuentaResult || cuentaResult.p_result !== 1) {
            throw new Error('Error al crear la cuenta del cliente');
        }

        // 6. Obtener datos completos del cliente recién creado
        const nuevoCliente = await this.validateCliente(data.emailClie, data.password);
        
        if (!nuevoCliente) {
            throw new Error('Error al obtener datos del cliente registrado');
        }

        // 7. Generar token y retornar
        return this.login(nuevoCliente);
    }

    /**
     * Encripta una contraseña usando bcrypt
     */
    async encriptarPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }
}
