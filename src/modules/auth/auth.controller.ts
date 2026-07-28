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
import { ChangePasswordDto } from './dto/change_password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutDto } from './dto/logout.dto';
import { AuthGuard } from '@nestjs/passport';
import { ForgotPasswordDto } from './dto/forgot_password.dto';
import { ResetPasswordDto } from './dto/reset_password.dto';
import { GenerarMfaDto } from './dto/generar_mfa.dto';
import { ActivarMfaDto } from './dto/activar_mfa.dto';
import { VerificarMfaDto } from './dto/verificar_mfa.dto';
import { ChangeRequiredPasswordDto } from './dto/change_required_password.dto';
import { DesactivarMfaDto } from './dto/desactivar_mfa.dto';

interface ICredential {
  usuario: string;
  clave: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
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

    if ('requiresPasswordChange' in result) {
      return result;
    }

    if ('requiresMfa' in result) {
      return result;
    }

    return this.authService.login(
      result.user,
      req.headers['user-agent'] || '',
      ip,
    );

    /*const user = result.user;

    if (ip.startsWith('::ffff:')) {
      ip = ip.split('::ffff:')[1];
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
    return this.authService.login(user);*/
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('cambiar-clave')
  async cambiarClave(@Req() req: any, @Body() body: ChangePasswordDto) {
    return this.authService.cambiarClave(
      Number(req.user.sub),
      body.claveActual,
      body.claveNueva,
    );
  }

  @Post('cambiar-clave-obligatoria')
  async cambiarClaveObligatoria(@Body() body: ChangeRequiredPasswordDto) {
    return this.authService.cambiarClaveObligatoria(
      body.changeToken,
      body.claveNueva,
    );
  }

  @Post('refresh')
  async refresh(
    @Body() body: RefreshTokenDto,
    @Req() req: Request,
    @Ip() ip: string,
  ) {
    return this.authService.refresh(
      body.refreshToken,
      req.headers['user-agent'] || '',
      ip,
    );
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
  async forgotPassword(@Body() body: ForgotPasswordDto, @Ip() ip: string) {
    return this.authService.solicitarRecuperacion(body.usuario, ip);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(body.token, body.nuevaClave);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('mfa/generar')
  async generarMfa(@Req() req: any, @Body() body: GenerarMfaDto) {
    return this.authService.generarMfa(
      Number(req.user.sub),
      req.user.username,
      body.claveActual,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('mfa/activar')
  async activarMfa(@Req() req: any, @Body() body: ActivarMfaDto) {
    return this.authService.activarMfa(
      Number(req.user.sub),
      req.user.username,
      body.codigo,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('mfa/desactivar')
  async desactivarMfa(@Req() req: any, @Body() body: DesactivarMfaDto) {
    return this.authService.desactivarMfa(
      Number(req.user.sub),
      body.claveActual,
      body.codigo,
    );
  }

  @Post('mfa/verificar-login')
  async verificarMfaLogin(
    @Body() body: VerificarMfaDto,
    @Req() req: Request,
    @Ip() ip: string,
  ) {
    return this.authService.verificarMfaLogin(
      body.mfaToken,
      body.codigo,
      req.headers['user-agent'] || '',
      ip,
    );
  }
}
