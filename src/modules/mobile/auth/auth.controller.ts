import { Body, Controller, Post } from '@nestjs/common';
import { LoginClienteDto, RegisterClienteDto } from './dto';
import { MobileAuthService } from './auth.service';

/**
 * Auth para cliente móvil.
 *
 * Se mantiene la ruta original del proyecto:
 * /api/auth/cliente
 */
@Controller('auth/cliente')
export class MobileAuthController {
  constructor(private readonly mobileAuthService: MobileAuthService) {}

  /**
   * Registrar cliente móvil.
   *
   * POST /api/auth/cliente/register
   */
  @Post('register')
  async register(@Body() body: RegisterClienteDto) {
    return this.mobileAuthService.register(body);
  }

  /**
   * Iniciar sesión cliente móvil.
   *
   * POST /api/auth/cliente/login
   */
  @Post('login')
  async login(@Body() body: LoginClienteDto) {
    return this.mobileAuthService.login(body);
  }
}
