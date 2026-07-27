import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CuentasService } from '../admin/seguridad/cuentas/cuentas.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RefreshTokenService } from './refresh_token/refresh_token.service';
import { randomUUID } from 'crypto';
import { randomBytes } from 'crypto';
import { PasswordResetTokenService } from './password_reset_token/password_reset_token.service';
import { PasswordPolicyService } from './password_policy/password_policy.service';
import { HistorialClaveService } from './historial_clave/historial_clave.service';
import { CuentaMfaService } from './cuenta_mfa/cuenta_mfa.service';
import { EmailService } from './email/email.service';
import { AccesosUsuariosService } from '../admin/seguridad/accesos/accesos.service';
import { formatDate } from '@helpers/utilities';
import { GeolocationService } from './services/geolocation.service';

type ValidateResult =
  | {
      success: true;
      user: any;
    }
  | {
      success: true;
      requiresMfa: true;
      userId: number;
    }
  | {
      success: true;
      requiresPasswordChange: true;
      userId: number;
      usuario: string;
    }
  | {
      success: false;
      reason: 'INVALID_CREDENTIALS' | 'INACTIVE' | 'BLOCKED';
      blockedUntil?: Date | null;
    };
@Injectable()
export class AuthService {
  private readonly MAX_INTENTOS = 5;
  private readonly MINUTOS_BLOQUEO = 15;

  constructor(
    private cuentasService: CuentasService,
    private jwtService: JwtService,
    private refreshTokenService: RefreshTokenService,
    private passwordResetTokenService: PasswordResetTokenService,
    private passwordPolicyService: PasswordPolicyService,
    private historialClaveService: HistorialClaveService,
    private cuentaMfaService: CuentaMfaService,
    private emailService: EmailService,
    private readonly accesosService: AccesosUsuariosService,
    private readonly geolocationService: GeolocationService,
  ) {}

  async validateUser(usuario: string, clave: string): Promise<ValidateResult> {
    const user = await this.cuentasService.buscarUsuario(usuario);

    if (!user) {
      return {
        success: false,
        reason: 'INVALID_CREDENTIALS',
      };
    }

    if (user.estado_cuen === 'inactivo') {
      return {
        success: false,
        reason: 'INACTIVE',
      };
    }

    if (user.estado_cuen === 'bloqueado') {
      const ahora = new Date();

      if (user.bloqueado_hasta && user.bloqueado_hasta > ahora) {
        return {
          success: false,
          reason: 'BLOCKED',
          blockedUntil: user.bloqueado_hasta,
        };
      }

      await this.cuentasService.desbloquearCuenta(user.ide_cuen);

      // Actualizamos el objeto en memoria
      // para continuar con datos coherentes
      user.estado_cuen = 'activo';
      user.intentos_fallidos = 0;
      user.bloqueado_hasta = null;
    }

    const passwordCorrecta = await bcrypt.compare(clave, user.password_cuen);

    if (!passwordCorrecta) {
      await this.cuentasService.incrementarIntentos(user.ide_cuen);

      const intentos = user.intentos_fallidos + 1;

      if (intentos >= this.MAX_INTENTOS) {
        const fechaBloqueo = new Date();

        fechaBloqueo.setMinutes(
          fechaBloqueo.getMinutes() + this.MINUTOS_BLOQUEO,
        );
        await this.cuentasService.bloquearCuenta(user.ide_cuen, fechaBloqueo);

        return {
          success: false,
          reason: 'BLOCKED',
          blockedUntil: fechaBloqueo,
        };
      }

      return {
        success: false,
        reason: 'INVALID_CREDENTIALS',
      };
    }

    if (user.debe_cambiar_clave) {
      return {
        success: true,
        requiresPasswordChange: true,
        userId: user.ide_cuen,
        usuario: user.usuario_cuen,
      };
    }

    const mfa = await this.cuentaMfaService.buscarPorCuenta(user.ide_cuen);

    if (mfa?.habilitado) {
      return {
        success: true,
        requiresMfa: true,
        userId: user.ide_cuen,
      };
    }

    await this.cuentasService.reiniciarIntentos(user.ide_cuen);

    await this.cuentasService.actualizarUltimoLogin(user.ide_cuen);

    const dataUser = { ...user };
    delete dataUser.password_cuen;

    return {
      success: true,
      user: dataUser,
    };
  }

  async login(user: any, navegador?: string, ip?: string) {
    const info = await this.cuentasService.getPerfilPermisos(user.ide_cuen);

    if (!info.length) {
      throw new Error('La cuenta no tiene permisos configurados');
    }

    const rutasSidebar = await this.cuentasService.getSidebarRutas(
      user.ide_cuen,
    );

    const tokens = await this.generarTokens(user, info, rutasSidebar);

    if (ip?.startsWith('::ffff:')) {
      ip = ip.substring(7);
    }

    const geo = await this.geolocationService.buscar(ip);

    await this.accesosService.insertarAccesoUsuario({
      ideCuen: user.ide_cuen,
      navegadorAcce: navegador ?? '',
      fechaAcce: formatDate(new Date()),
      numIntFallAcce: 0,
      ipAcce: ip ?? '',
      latitudAcce: geo?.latitud ?? null,
      longitudAcce: geo?.longitud ?? null,
    });

    return {
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      user: {
        id: tokens.payload.sub,
        username: tokens.payload.username,
        state: tokens.payload.state,
        perfil: tokens.payload.perfil,
        permisos: tokens.payload.permisos,
        ideEmpl: tokens.payload.ideEmpl,
        rutas_sidebar: tokens.rutasSidebar,
      },
    };
  }

  private async generarTokens(user: any, permisos: any[], rutasSidebar: any) {
    const accessPayload = {
      sub: user.ide_cuen,
      username: user.usuario_cuen,
      state: user.estado_cuen,
      perfil: permisos[0].nombre_perf,
      ideEmpl: user.ide_empl,
      permisos: permisos.map((p) => ({
        ruta: p.ruta_opci,
        listar: p.listar === 'si',
        insertar: p.insertar === 'si',
        modificar: p.modificar === 'si',
        eliminar: p.eliminar === 'si',
        activo: p.activo_opci === 'si',
        nombre: p.nombre_opci,
        nivel: p.nivel_opci,
        padre: p.padre_opci,
      })),
    };

    const jti = randomUUID();

    const refreshPayload = {
      sub: user.ide_cuen,
      jti,
    };

    const accessToken = this.jwtService.sign(accessPayload, {
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(refreshPayload, {
      expiresIn: '7d',
    });

    await this.refreshTokenService.guardar(user.ide_cuen, jti, refreshToken);

    return {
      accessToken,
      refreshToken,
      payload: accessPayload,
      rutasSidebar,
    };
  }

  async cambiarClave(ideCuen: number, claveActual: string, claveNueva: string) {
    const cuenta = await this.cuentasService.buscarCuentaInterna(ideCuen);

    if (!cuenta) {
      return {
        success: false,
        message: 'Cuenta no encontrada',
      };
    }

    const validaClave = await bcrypt.compare(claveActual, cuenta.passwordCuen);

    if (!validaClave) {
      return {
        success: false,
        message: 'La clave actual es incorrecta',
      };
    }

    const politica = this.passwordPolicyService.validar(claveNueva);

    if (!politica.valido) {
      return {
        success: false,
        message: politica.errores,
      };
    }

    const repetida = await this.historialClaveService.fueUsadaAnteriormente(
      ideCuen,
      claveNueva,
    );

    if (repetida) {
      return {
        success: false,
        message: 'No puede reutilizar una de sus últimas 5 contraseñas',
      };
    }

    // Guardamos la clave actual antes de reemplazarla
    await this.historialClaveService.guardar(ideCuen, cuenta.passwordCuen);

    const nuevoHash = await this.cuentasService.encriptadorHash(claveNueva);

    await this.cuentasService.cambiarClave(ideCuen, nuevoHash);

    await this.refreshTokenService.revocarTodos(ideCuen);

    return {
      success: true,
      message: 'Clave actualizada correctamente',
    };
  }

  async refresh(refreshToken: string) {
    // 1. Verificar JWT
    let payload: any;

    try {
      payload = this.jwtService.verify(refreshToken);
    } catch {
      throw new UnauthorizedException('Refresh token inválido');
    }

    // 2. Buscar registro
    const registro = await this.refreshTokenService.buscarPorJti(payload.jti);

    if (!registro) {
      throw new UnauthorizedException('Refresh token revocado');
    }

    // 3. Comparar hash
    const valido = await bcrypt.compare(refreshToken, registro.tokenHash);

    if (!valido) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    // 4. Verificar expiración
    if (registro.fechaExpiracion < new Date()) {
      await this.refreshTokenService.revocar(registro.ideReft);

      throw new UnauthorizedException('Refresh token expirado');
    }

    // ===== AQUÍ EMPIEZA EL PASO 16 =====

    await this.refreshTokenService.revocar(registro.ideReft);

    const info = await this.cuentasService.getPerfilPermisos(
      registro.ideCuen.toString(),
    );

    if (!info.length) {
      await this.refreshTokenService.revocar(registro.ideReft);

      throw new UnauthorizedException(
        'La cuenta no tiene permisos configurados',
      );
    }

    const rutasSidebar = await this.cuentasService.getSidebarRutas(
      registro.ideCuen.toString(),
    );

    const user = {
      ide_cuen: info[0].ide_cuen,
      usuario_cuen: info[0].usuario_cuen,
      estado_cuen: info[0].estado_cuen,
      ide_empl: info[0].ide_empl,
    };

    const tokens = await this.generarTokens(user, info, rutasSidebar);

    return {
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
    };
  }

  async logout(refreshToken: string) {
    let payload: any;

    try {
      payload = this.jwtService.verify(refreshToken);
    } catch {
      return {
        success: true,
      };
    }

    const registro = await this.refreshTokenService.buscarPorJti(payload.jti);

    if (!registro) {
      return {
        success: true,
      };
    }

    await this.refreshTokenService.revocar(registro.ideReft);

    return {
      success: true,
    };
  }

  async logoutAll(ideCuen: number) {
    await this.refreshTokenService.revocarTodos(ideCuen);

    return {
      success: true,
    };
  }

  async solicitarRecuperacion(usuario: string) {
    const cuenta = await this.cuentasService.buscarUsuario(usuario);

    /*
    Por seguridad no revelamos si existe o no.
    En sistemas reales siempre se responde igual.
  */

    if (!cuenta) {
      return {
        success: true,
        message: 'Si la cuenta existe, recibirá instrucciones de recuperación',
      };
    }

    const token = randomBytes(32).toString('hex');

    const expiracion = new Date();

    expiracion.setMinutes(expiracion.getMinutes() + 15);

    //await this.refreshTokenService;

    await this.passwordResetTokenService.guardar(
      cuenta.ide_cuen,
      token,
      expiracion,
    );

    /*
    Aquí posteriormente irá:
    - envío de correo
    - enlace frontend
  */
    if (!cuenta.correo_empl) {
      return {
        success: true,
        message:
          'La cuenta existe pero no tiene correo registrado. Contacte al administrador.',
      };
    }

    await this.emailService.enviarRecuperacionPassword(
      cuenta.correo_empl,
      cuenta.usuario_cuen,
      token,
    );
    return {
      success: true,
      message: 'Si la cuenta existe, recibirá instrucciones de recuperación',

      // temporal para pruebas
      token,
    };
  }

  async resetPassword(token: string, nuevaClave: string) {
    const registro = await this.passwordResetTokenService.validar(token);

    if (!registro) {
      throw new UnauthorizedException('Token inválido o expirado');
    }

    if (registro.fechaExpiracion < new Date()) {
      await this.passwordResetTokenService.usar(registro.idePrt);

      throw new UnauthorizedException('Token expirado');
    }

    const politica = this.passwordPolicyService.validar(nuevaClave);

    if (!politica.valido) {
      return {
        success: false,
        message: politica.errores,
      };
    }

    const cuenta = await this.cuentasService.buscarCuentaInterna(
      registro.ideCuen,
    );

    if (!cuenta) {
      throw new UnauthorizedException('Cuenta no encontrada');
    }

    const repetida = await this.historialClaveService.fueUsadaAnteriormente(
      registro.ideCuen,
      nuevaClave,
    );

    if (repetida) {
      throw new UnauthorizedException(
        'No puede reutilizar una contraseña anterior',
      );
    }

    // Guardar contraseña antigua antes de reemplazarla
    await this.historialClaveService.guardar(
      registro.ideCuen,
      cuenta.passwordCuen,
    );

    const nuevoHash = await this.cuentasService.encriptadorHash(nuevaClave);

    await this.cuentasService.cambiarClave(registro.ideCuen, nuevoHash);

    await this.refreshTokenService.revocarTodos(registro.ideCuen);

    await this.passwordResetTokenService.usar(registro.idePrt);

    return {
      success: true,
      message: 'Contraseña actualizada correctamente',
    };
  }

  async verificarMfaLogin(
    ideCuen: number,
    codigo: string,
    navegador?: string,
    ip?: string,
  ) {
    const resultado = await this.cuentaMfaService.verificarLogin(
      ideCuen,
      codigo,
    );

    if (!resultado.valido) {
      throw new UnauthorizedException(resultado.message);
    }

    const cuenta = await this.cuentasService.buscarCuentaInterna(ideCuen);

    if (!cuenta) {
      throw new UnauthorizedException('Cuenta no encontrada');
    }

    await this.cuentasService.reiniciarIntentos(ideCuen);

    await this.cuentasService.actualizarUltimoLogin(ideCuen);

    return this.login(
      {
        ide_cuen: cuenta.ideCuen,
        usuario_cuen: cuenta.usuarioCuen,
        estado_cuen: cuenta.estadoCuen,
        ide_empl: cuenta.ideEmpl,
      },
      navegador,
      ip,
    );
  }
}
