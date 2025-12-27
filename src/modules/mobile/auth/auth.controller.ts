import { Controller, Post, Body, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ClienteAuthService } from './auth.service';
import { LoginClienteDto, RegisterClienteDto } from './dto';

@Controller('auth/cliente')
export class ClienteAuthController {

    constructor(private readonly clienteAuthService: ClienteAuthService) {}

    /**
     * Login para clientes de la app móvil
     * POST /auth/cliente/login
     */
    @Post('login')
    async login(@Body() body: LoginClienteDto) {
        const user = await this.clienteAuthService.validateCliente(body.usuario, body.clave);
        
        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas o cuenta inactiva');
        }

        return this.clienteAuthService.login(user);
    }

    /**
     * Registro de nuevos clientes desde la app móvil
     * POST /auth/cliente/register
     */
    @Post('register')
    async register(@Body() body: RegisterClienteDto) {
        try {
            return await this.clienteAuthService.register(body);
        } catch (error) {
            throw new BadRequestException(error.message || 'Error al registrar el cliente');
        }
    }
}
