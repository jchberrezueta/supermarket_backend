import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Req,
  Ip,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccesosUsuariosService } from '../admin/seguridad/accesos/accesos.service';
import { CreateAccesoUsuarioDto } from '../admin/seguridad/accesos/dto/create_acceso.dto';
import { formatDate } from '@helpers/utilities';
import { ChangePasswordDto } from './dto/change_password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutDto } from './dto/logout.dto';
import { AuthGuard } from '@nestjs/passport';
import { ForgotPasswordDto } from './dto/forgot_password.dto';
import { ResetPasswordDto } from './dto/reset_password.dto';
import { CuentaMfaService } from './cuenta_mfa/cuenta_mfa.service';
import { GenerarMfaDto } from './dto/generar_mfa.dto';
import { ActivarMfaDto } from './dto/activar_mfa.dto';
import { VerificarMfaDto } from './dto/verificar_mfa.dto';

interface ICredential {
  usuario: string;
  clave: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cuentaMfaService: CuentaMfaService,
    private servicio: AccesosUsuariosService,
  ) {}

  @Post('login')
  async login(@Body() body: ICredential, @Req() req: Request, @Ip() ip) {
    const result = await this.authService.validateUser(
      body.usuario,
      body.clave,
    );

    if (result.success === false) {
      if (result.reason === 'BLOCKED') {
        throw new UnauthorizedException(
          `Cuenta bloqueada hasta ${result.blockedUntil}`,
        );
      }

      if (result.reason === 'INACTIVE') {
        throw new UnauthorizedException('Cuenta inactiva');
      }

      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!('user' in result)) {
      throw new Error();
    }

    const user = result.user;
    if (ip.startsWith('::ffff:')) {
      ip = ip.split('::ffff:')[1]; // ahora tienes IPv4
    }
    const accesoUsuario: CreateAccesoUsuarioDto = {
      ideCuen: user.ide_cuen,
      navegadorAcce: req.headers['user-agent'] || '',
      fechaAcce: formatDate(new Date()),
      numIntFallAcce: 0,
      ipAcce: ip || '999.999.999.999',
      latitudAcce: null,
      longitudAcce: null,
    };
    // Registrar acceso usuario
    await this.servicio.insertarAccesoUsuario(accesoUsuario);
    return this.authService.login(user);
  }

  @Post('cambiar-clave')
  async cambiarClave(@Body() body: ChangePasswordDto) {
    const result = await this.authService.cambiarClave(
      body.ideCuen,
      body.claveActual,
      body.claveNueva,
    );

    if (!result.success) {
      throw new UnauthorizedException(result.message);
    }

    return result;
  }

  @Post('refresh')
  async refresh(@Body() body: RefreshTokenDto) {
    return this.authService.refresh(body.refreshToken);
  }

  @Post('logout')
  async logout(@Body() body: LogoutDto) {
    return this.authService.logout(body.refreshToken);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout-all')
  async logoutAll(@Req() req: any) {
    return this.authService.logoutAll(req.user.sub);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.solicitarRecuperacion(body.usuario);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(body.token, body.nuevaClave);
  }

  @Post('mfa/generar')
  async generarMfa(@Body() body: GenerarMfaDto) {
    return this.cuentaMfaService.generarConfiguracion(
      body.ideCuen,
      `usuario-${body.ideCuen}`,
    );
  }

  @Post('mfa/activar')
  async activarMfa(@Body() body: ActivarMfaDto) {
    return this.cuentaMfaService.confirmarActivacion(body.ideCuen, body.codigo);
  }

  @Post('mfa/verificar-login')
  async verificarMfaLogin(@Body() body: VerificarMfaDto) {
    return this.authService.verificarMfaLogin(body.ideCuen, body.codigo);
  }
}
