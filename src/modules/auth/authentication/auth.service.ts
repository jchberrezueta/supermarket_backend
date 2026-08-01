import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CuentasService } from '../../admin/seguridad/cuentas/cuentas.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RefreshTokenService } from '../sessions/refresh_token.service';
import { randomUUID } from 'crypto';
import { PasswordResetTokenService } from '../password/password_reset_token.service';
import { PasswordPolicyService } from '../password/password_policy.service';
import { HistorialClaveService } from '../password/historial-clave/historial_clave.service';
import { CuentaMfaService } from '../mfa/cuenta_mfa.service';
import { EmailService } from '../email/email.service';
import { AccesosUsuariosService } from '../../admin/seguridad/accesos/accesos.service';
import { GeolocationService } from '../services/geolocation.service';

import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  CuentaEntity,
  PasswordResetTokenEntity,
  RefreshTokenEntity,
} from '@entities';
import { HistorialClaveEntity } from '@entities';
import { ConfigService } from '@nestjs/config';

type ValidateResult =
  | {
      success: true;
      user: any;
    }
  | {
      success: true;
      requiresMfa: true;
      mfaToken: string;
    }
  | {
      success: true;
      requiresPasswordChange: true;
      changeToken: string;
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
    private readonly configService: ConfigService,

    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async validateUser(
    usuario: string,
    clave: string,
    navegador?: string,
    ip?: string,
  ): Promise<ValidateResult> {
    const usuarioNormalizado = usuario.trim().toLowerCase();

    const navegadorNormalizado = navegador?.trim() || 'desconocido';

    const ipNormalizada = this.normalizarIp(ip);

    const user = await this.cuentasService.buscarUsuario(usuarioNormalizado);

    if (!user) {
      await this.accesosService.registrarAccesoFallido({
        ideCuen: null,
        usuario: usuarioNormalizado,
        motivo: 'credenciales_invalidas',
        intentos: 1,
        navegador: navegadorNormalizado,
        ip: ipNormalizada,
      });

      return {
        success: false,
        reason: 'INVALID_CREDENTIALS',
      };
    }

    if (user.estado_cuen === 'inactivo') {
      await this.accesosService.registrarAccesoFallido({
        ideCuen: user.ide_cuen,
        usuario: user.usuario_cuen,
        motivo: 'cuenta_inactiva',
        intentos: user.intentos_fallidos,
        navegador: navegadorNormalizado,
        ip: ipNormalizada,
      });

      return {
        success: false,
        reason: 'INACTIVE',
      };
    }

    if (user.estado_cuen === 'bloqueado') {
      await this.accesosService.registrarAccesoFallido({
        ideCuen: user.ide_cuen,
        usuario: user.usuario_cuen,
        motivo: 'cuenta_bloqueada',
        intentos: user.intentos_fallidos,
        navegador: navegadorNormalizado,
        ip: ipNormalizada,
      });

      return {
        success: false,
        reason: 'BLOCKED',
        blockedUntil: null,
      };
    }

    const ahora = new Date();

    if (user.bloqueado_hasta && user.bloqueado_hasta > ahora) {
      await this.accesosService.registrarAccesoFallido({
        ideCuen: user.ide_cuen,
        usuario: user.usuario_cuen,
        motivo: 'bloqueo_temporal',
        intentos: user.intentos_fallidos,
        navegador: navegadorNormalizado,
        ip: ipNormalizada,
      });

      return {
        success: false,
        reason: 'BLOCKED',
        blockedUntil: user.bloqueado_hasta,
      };
    }

    if (user.bloqueado_hasta && user.bloqueado_hasta <= ahora) {
      await this.cuentasService.desbloquearCuenta(user.ide_cuen);

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

        await this.accesosService.registrarAccesoFallido({
          ideCuen: user.ide_cuen,
          usuario: user.usuario_cuen,
          motivo: 'max_intentos',
          intentos,
          navegador: navegadorNormalizado,
          ip: ipNormalizada,
        });

        return {
          success: false,
          reason: 'BLOCKED',
          blockedUntil: fechaBloqueo,
        };
      }

      await this.accesosService.registrarAccesoFallido({
        ideCuen: user.ide_cuen,
        usuario: user.usuario_cuen,
        motivo: 'credenciales_invalidas',
        intentos,
        navegador: navegadorNormalizado,
        ip: ipNormalizada,
      });

      return {
        success: false,
        reason: 'INVALID_CREDENTIALS',
      };
    }

    if (user.debe_cambiar_clave) {
      const changeToken = this.generarTokenCambioObligatorio(
        user.ide_cuen,
        user.usuario_cuen,
      );

      return {
        success: true,
        requiresPasswordChange: true,
        changeToken,
        usuario: user.usuario_cuen,
      };
    }

    const mfa = await this.cuentaMfaService.buscarPorCuenta(user.ide_cuen);

    if (mfa?.habilitado) {
      return {
        success: true,
        requiresMfa: true,
        mfaToken: this.generarTokenMfaLogin(user.ide_cuen, user.usuario_cuen),
      };
    }

    await this.cuentasService.reiniciarIntentos(user.ide_cuen);

    await this.cuentasService.actualizarUltimoLogin(user.ide_cuen);

    const dataUser = {
      ...user,
    };

    delete dataUser.password_cuen;

    return {
      success: true,
      user: dataUser,
    };
  }

  async login(user: any, navegador?: string, ip?: string) {
    const info = await this.cuentasService.getPerfilPermisos(
      String(user.ide_cuen),
    );

    if (!info.length) {
      throw new UnauthorizedException(
        'La cuenta no tiene permisos configurados',
      );
    }

    const rutasSidebar = await this.cuentasService.getSidebarRutas(
      String(user.ide_cuen),
    );

    const ipNormalizada = this.normalizarIp(ip);

    const navegadorNormalizado = navegador?.trim() || 'desconocido';

    const tokens = await this.generarTokens(
      user,
      info,
      rutasSidebar,
      ipNormalizada,
      navegadorNormalizado,
    );

    const geo = ipNormalizada
      ? await this.geolocationService.buscar(ipNormalizada)
      : null;

    await this.accesosService.registrarAccesoExitoso({
      ideCuen: user.ide_cuen,
      usuario: user.usuario_cuen,
      intentosFallidos: Math.max(0, Number(user.intentos_fallidos ?? 0)),
      navegador: navegadorNormalizado,
      ip: ipNormalizada,
      latitud: geo?.latitud ?? null,
      longitud: geo?.longitud ?? null,
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

  private async generarTokens(
    user: any,
    permisos: any[],
    rutasSidebar: any,
    ip?: string | null,
    userAgent?: string | null,
  ) {
    const accessPayload = {
      tokenType: 'admin',
      sub: user.ide_cuen,
      username: user.usuario_cuen,
      state: user.estado_cuen,
      perfil: permisos[0].nombre_perf,
      ideEmpl: user.ide_empl,
      permisos: permisos.map((permiso) => ({
        ruta: permiso.ruta_opci,
        listar: permiso.listar === 'si',
        insertar: permiso.insertar === 'si',
        modificar: permiso.modificar === 'si',
        eliminar: permiso.eliminar === 'si',
        activo: permiso.activo_opci === 'si',
        nombre: permiso.nombre_opci,
        nivel: permiso.nivel_opci,
        padre: permiso.padre_opci,
      })),
    };

    const jti = randomUUID();

    const refreshPayload = {
      sub: user.ide_cuen,
      jti,
      purpose: 'refresh',
    };

    const accessToken = this.jwtService.sign(accessPayload, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(refreshPayload, {
      secret: this.obtenerRefreshSecret(),
      expiresIn: '7d',
    });

    await this.refreshTokenService.guardar(
      user.ide_cuen,
      jti,
      refreshToken,
      ip,
      userAgent,
      null,
    );

    return {
      accessToken,
      refreshToken,
      payload: accessPayload,
      rutasSidebar,
    };
  }

  private generarTokenMfaLogin(ideCuen: number, usuario: string): string {
    return this.jwtService.sign(
      {
        sub: ideCuen,
        username: usuario,
        purpose: 'mfa_login',
      },
      {
        secret: this.obtenerMfaChallengeSecret(),
        expiresIn: '5m',
      },
    );
  }

  private obtenerMfaChallengeSecret(): string {
    const secret = this.configService.get<string>('MFA_CHALLENGE_SECRET');

    if (!secret) {
      throw new Error('MFA_CHALLENGE_SECRET es obligatorio');
    }

    return secret;
  }

  private generarTokenCambioObligatorio(
    ideCuen: number,
    usuario: string,
  ): string {
    return this.jwtService.sign(
      {
        sub: ideCuen,
        username: usuario,
        purpose: 'password_change',
      },
      {
        expiresIn: '5m',
      },
    );
  }

  async generarMfa(ideCuen: number, usuario: string, claveActual: string) {
    const cuenta = await this.cuentasService.buscarCuentaInterna(ideCuen);

    if (!cuenta || cuenta.estadoCuen !== 'activo') {
      throw new UnauthorizedException('La cuenta no está disponible');
    }

    const claveValida = await bcrypt.compare(claveActual, cuenta.passwordCuen);

    if (!claveValida) {
      throw new UnauthorizedException('La contraseña actual es incorrecta');
    }

    return this.cuentaMfaService.generarConfiguracion(ideCuen, usuario);
  }

  async activarMfa(ideCuen: number, usuario: string, codigo: string) {
    const resultado = await this.cuentaMfaService.confirmarActivacion(
      ideCuen,
      codigo,
      usuario,
    );

    await this.refreshTokenService.revocarTodos(ideCuen);

    return resultado;
  }

  async desactivarMfa(ideCuen: number, claveActual: string, codigo: string) {
    const cuenta = await this.cuentasService.buscarCuentaInterna(ideCuen);

    if (!cuenta || cuenta.estadoCuen !== 'activo') {
      throw new UnauthorizedException('La cuenta no está disponible');
    }

    const claveValida = await bcrypt.compare(claveActual, cuenta.passwordCuen);

    if (!claveValida) {
      throw new UnauthorizedException('La contraseña actual es incorrecta');
    }

    const resultado = await this.cuentaMfaService.desactivar(ideCuen, codigo);

    await this.refreshTokenService.revocarTodos(ideCuen);

    return resultado;
  }

  async cambiarClave(ideCuen: number, claveActual: string, claveNueva: string) {
    return this.actualizarClaveTransaccional({
      ideCuen,
      claveActual,
      claveNueva,
      cambioObligatorio: false,
    });
  }

  async cambiarClaveObligatoria(changeToken: string, claveNueva: string) {
    let payload: any;

    try {
      payload = this.jwtService.verify(changeToken?.trim());
    } catch {
      throw new UnauthorizedException(
        'La autorización para cambiar la contraseña es inválida o expiró',
      );
    }

    if (
      payload?.purpose !== 'password_change' ||
      !Number.isInteger(Number(payload?.sub))
    ) {
      throw new UnauthorizedException(
        'La autorización para cambiar la contraseña no es válida',
      );
    }

    return this.actualizarClaveTransaccional({
      ideCuen: Number(payload.sub),
      claveNueva,
      cambioObligatorio: true,
    });
  }

  private async actualizarClaveTransaccional(params: {
    ideCuen: number;
    claveNueva: string;
    claveActual?: string;
    cambioObligatorio: boolean;
  }) {
    const politica = this.passwordPolicyService.validar(params.claveNueva);

    if (!politica.valido) {
      throw new BadRequestException(politica.errores);
    }

    return this.dataSource.transaction(async (manager) => {
      const cuentaRepository = manager.getRepository(CuentaEntity);

      const cuenta = await cuentaRepository
        .createQueryBuilder('cuenta')
        .setLock('pessimistic_write')
        .where('cuenta.ide_cuen = :ideCuen', {
          ideCuen: params.ideCuen,
        })
        .getOne();

      if (!cuenta) {
        throw new UnauthorizedException('La cuenta no está disponible');
      }

      if (cuenta.estadoCuen !== 'activo') {
        throw new UnauthorizedException('La cuenta no está activa');
      }

      if (params.cambioObligatorio && !cuenta.debeCambiarClave) {
        throw new UnauthorizedException(
          'La autorización de cambio obligatorio ya no es válida',
        );
      }

      /*
       * En el cambio normal se debe confirmar
       * la contraseña actual.
       *
       * En el cambio obligatorio, la contraseña ya fue
       * comprobada antes de emitir el token temporal.
       */
      if (!params.cambioObligatorio) {
        const claveActualValida = await bcrypt.compare(
          params.claveActual ?? '',
          cuenta.passwordCuen,
        );

        if (!claveActualValida) {
          throw new UnauthorizedException('La contraseña actual es incorrecta');
        }
      }

      /*
       * La nueva contraseña tampoco puede ser
       * igual a la contraseña actual.
       */
      const coincideConActual = await bcrypt.compare(
        params.claveNueva,
        cuenta.passwordCuen,
      );

      if (coincideConActual) {
        throw new BadRequestException(
          'La nueva contraseña debe ser diferente de la contraseña actual',
        );
      }

      const historialRepository = manager.getRepository(HistorialClaveEntity);

      const ultimasClaves = await historialRepository.find({
        where: {
          ideCuen: cuenta.ideCuen,
        },
        order: {
          fechaIngre: 'DESC',
        },
        take: 5,
      });

      for (const claveAnterior of ultimasClaves) {
        const fueUtilizada = await bcrypt.compare(
          params.claveNueva,
          claveAnterior.passwordHash,
        );

        if (fueUtilizada) {
          throw new BadRequestException(
            'No puede reutilizar una de sus últimas 5 contraseñas',
          );
        }
      }

      /*
       * Se conserva la contraseña actual antes
       * de reemplazarla.
       */
      const historial = historialRepository.create({
        ideCuen: cuenta.ideCuen,
        passwordHash: cuenta.passwordCuen,
        usuaIngre: cuenta.usuarioCuen,
      });

      await historialRepository.save(historial);

      const nuevoHash = await this.cuentasService.encriptadorHash(
        params.claveNueva,
      );

      cuenta.passwordCuen = nuevoHash;
      cuenta.debeCambiarClave = false;
      cuenta.intentosFallidosCuen = 0;
      cuenta.fechaBloqueoCuen = null;
      cuenta.usuaActua = cuenta.usuarioCuen;
      cuenta.fechaActua = new Date();

      await cuentaRepository.save(cuenta);

      /*
       * Cualquier enlace de recuperación pendiente
       * queda invalidado.
       */
      await manager
        .getRepository(PasswordResetTokenEntity)
        .createQueryBuilder()
        .update(PasswordResetTokenEntity)
        .set({
          utilizado: true,
          usuaActua: cuenta.usuarioCuen,
          fechaActua: () => 'CURRENT_TIMESTAMP',
        })
        .where('ide_cuen = :ideCuen', {
          ideCuen: cuenta.ideCuen,
        })
        .andWhere('utilizado = false')
        .execute();

      /*
       * Todas las sesiones anteriores se revocan.
       */
      await manager
        .getRepository(RefreshTokenEntity)
        .createQueryBuilder()
        .update(RefreshTokenEntity)
        .set({
          revocado: true,
          usuaActua: cuenta.usuarioCuen,
          fechaActua: () => 'CURRENT_TIMESTAMP',
        })
        .where('ide_cuen = :ideCuen', {
          ideCuen: cuenta.ideCuen,
        })
        .andWhere('revocado = false')
        .execute();

      return {
        success: true,
        message:
          'Contraseña actualizada correctamente. Inicie sesión nuevamente.',
      };
    });
  }

  async refresh(refreshToken: string, navegador?: string, ip?: string) {
    const tokenLimpio = refreshToken?.trim();

    if (!tokenLimpio) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    let payload: any;

    try {
      payload = this.jwtService.verify(tokenLimpio, {
        secret: this.obtenerRefreshSecret(),
      });
    } catch {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }

    if (
      payload?.purpose !== 'refresh' ||
      !payload?.jti ||
      !Number.isInteger(Number(payload?.sub))
    ) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    const ideCuen = Number(payload.sub);

    const registro = await this.refreshTokenService.buscarPorJti(payload.jti);

    if (!registro || registro.ideCuen !== ideCuen) {
      throw new UnauthorizedException('Refresh token revocado');
    }

    const coincide = await bcrypt.compare(tokenLimpio, registro.tokenHash);

    if (!coincide) {
      await this.refreshTokenService.revocar(registro.ideReft);

      throw new UnauthorizedException('Refresh token inválido');
    }

    if (registro.fechaExpiracion <= new Date()) {
      await this.refreshTokenService.revocar(registro.ideReft);

      throw new UnauthorizedException('Refresh token expirado');
    }

    const cuenta = await this.cuentasService.buscarCuentaInterna(ideCuen);

    if (!cuenta || cuenta.estadoCuen !== 'activo') {
      await this.refreshTokenService.revocarTodos(ideCuen);

      throw new UnauthorizedException('La cuenta no está activa');
    }

    if (cuenta.debeCambiarClave) {
      await this.refreshTokenService.revocarTodos(ideCuen);

      throw new UnauthorizedException('La cuenta debe cambiar su contraseña');
    }

    const ahora = new Date();

    if (cuenta.fechaBloqueoCuen && cuenta.fechaBloqueoCuen > ahora) {
      await this.refreshTokenService.revocarTodos(ideCuen);

      throw new UnauthorizedException('La cuenta está bloqueada temporalmente');
    }

    const info = await this.cuentasService.getPerfilPermisos(String(ideCuen));

    if (!info.length) {
      await this.refreshTokenService.revocarTodos(ideCuen);

      throw new UnauthorizedException(
        'La cuenta no tiene permisos configurados',
      );
    }

    const rutasSidebar = await this.cuentasService.getSidebarRutas(
      String(ideCuen),
    );

    /*
     * Rotación: el token presentado deja
     * de ser válido antes de emitir el nuevo.
     */
    await this.refreshTokenService.revocar(registro.ideReft);

    const user = {
      ide_cuen: cuenta.ideCuen,
      usuario_cuen: cuenta.usuarioCuen,
      estado_cuen: cuenta.estadoCuen,
      ide_empl: cuenta.ideEmpl,
    };

    const tokens = await this.generarTokens(
      user,
      info,
      rutasSidebar,
      this.normalizarIp(ip),
      navegador?.trim() || 'desconocido',
    );

    return {
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
    };
  }

  async logout(refreshToken: string) {
    const tokenLimpio = refreshToken?.trim();

    if (!tokenLimpio) {
      return {
        success: true,
      };
    }

    let payload: any;

    try {
      payload = this.jwtService.verify(tokenLimpio, {
        secret: this.obtenerRefreshSecret(),
      });
    } catch {
      return {
        success: true,
      };
    }

    if (payload?.purpose !== 'refresh' || !payload?.jti) {
      return {
        success: true,
      };
    }

    const registro = await this.refreshTokenService.buscarPorJti(payload.jti);

    if (registro) {
      await this.refreshTokenService.revocar(registro.ideReft);
    }

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

  async solicitarRecuperacion(usuario: string, ipSolicitud?: string | null) {
    const respuesta = {
      success: true,
      message: 'Si la cuenta existe, recibirá instrucciones de recuperación',
    };

    const usuarioNormalizado = usuario.trim().toLowerCase();

    const cuenta = await this.cuentasService.buscarUsuario(usuarioNormalizado);

    /*
     * Se devuelve siempre la misma respuesta para no revelar
     * si el usuario existe o si tiene correo registrado.
     */
    if (!cuenta?.correo_empl) {
      return respuesta;
    }

    let ipNormalizada = ipSolicitud?.trim() || null;

    if (ipNormalizada?.startsWith('::ffff:')) {
      ipNormalizada = ipNormalizada.substring(7);
    }

    const fechaExpiracion = new Date();

    fechaExpiracion.setMinutes(fechaExpiracion.getMinutes() + 15);

    const token = await this.passwordResetTokenService.generar(
      cuenta.ide_cuen,
      fechaExpiracion,
      ipNormalizada,
    );

    try {
      await this.emailService.enviarRecuperacionPassword(
        cuenta.correo_empl,
        cuenta.usuario_cuen,
        token,
      );
    } catch (error) {
      console.error(
        'No fue posible enviar el correo de recuperación',
        error instanceof Error ? error.message : error,
      );
    }

    return respuesta;
  }

  async resetPassword(token: string, nuevaClave: string) {
    const tokenLimpio = token?.trim();

    if (!tokenLimpio) {
      throw new UnauthorizedException('Token inválido o expirado');
    }

    const politica = this.passwordPolicyService.validar(nuevaClave);

    if (!politica.valido) {
      return {
        success: false,
        message: politica.errores,
      };
    }

    const tokenHash = this.passwordResetTokenService.calcularHash(tokenLimpio);

    const nuevoHash = await this.cuentasService.encriptadorHash(nuevaClave);

    return this.dataSource.transaction(async (manager) => {
      const tokenRepository = manager.getRepository(PasswordResetTokenEntity);

      const tokenRegistro = await tokenRepository
        .createQueryBuilder('token')
        .setLock('pessimistic_write')
        .where('token.token_hash = :tokenHash', {
          tokenHash,
        })
        .andWhere('token.utilizado = false')
        .getOne();

      if (!tokenRegistro || tokenRegistro.fechaExpiracion <= new Date()) {
        throw new UnauthorizedException('Token inválido o expirado');
      }

      const cuentaRepository = manager.getRepository(CuentaEntity);

      const cuenta = await cuentaRepository
        .createQueryBuilder('cuenta')
        .setLock('pessimistic_write')
        .where('cuenta.ide_cuen = :ideCuen', {
          ideCuen: tokenRegistro.ideCuen,
        })
        .getOne();

      if (!cuenta) {
        throw new UnauthorizedException('Token inválido o expirado');
      }

      const coincideActual = await bcrypt.compare(
        nuevaClave,
        cuenta.passwordCuen,
      );

      if (coincideActual) {
        throw new UnauthorizedException(
          'No puede reutilizar su contraseña actual',
        );
      }

      const historialRepository = manager.getRepository(HistorialClaveEntity);

      const anteriores = await historialRepository.find({
        where: {
          ideCuen: cuenta.ideCuen,
        },
        order: {
          fechaIngre: 'DESC',
        },
        take: 5,
      });

      for (const anterior of anteriores) {
        const coincide = await bcrypt.compare(
          nuevaClave,
          anterior.passwordHash,
        );

        if (coincide) {
          throw new UnauthorizedException(
            'No puede reutilizar una de sus últimas 5 contraseñas',
          );
        }
      }

      const historial = historialRepository.create({
        ideCuen: cuenta.ideCuen,
        passwordHash: cuenta.passwordCuen,
        usuaIngre: 'sistema',
      });

      await historialRepository.save(historial);

      cuenta.passwordCuen = nuevoHash;
      cuenta.debeCambiarClave = false;
      cuenta.intentosFallidosCuen = 0;
      cuenta.fechaBloqueoCuen = null;
      cuenta.usuaActua = 'sistema';
      cuenta.fechaActua = new Date();

      await cuentaRepository.save(cuenta);

      /*
       * El token utilizado y cualquier otro token activo
       * de la cuenta quedan invalidados.
       */
      await tokenRepository
        .createQueryBuilder()
        .update(PasswordResetTokenEntity)
        .set({
          utilizado: true,
          usuaActua: 'sistema',
          fechaActua: () => 'CURRENT_TIMESTAMP',
        })
        .where('ide_cuen = :ideCuen', {
          ideCuen: cuenta.ideCuen,
        })
        .andWhere('utilizado = false')
        .execute();

      /*
       * Revocar todas las sesiones existentes.
       */
      await manager
        .getRepository(RefreshTokenEntity)
        .createQueryBuilder()
        .update(RefreshTokenEntity)
        .set({
          revocado: true,
          usuaActua: 'sistema',
          fechaActua: () => 'CURRENT_TIMESTAMP',
        })
        .where('ide_cuen = :ideCuen', {
          ideCuen: cuenta.ideCuen,
        })
        .andWhere('revocado = false')
        .execute();

      return {
        success: true,
        message: 'Contraseña actualizada correctamente',
      };
    });
  }

  async obtenerEstadoMfa(ideCuen: number) {
    const configuracion = await this.cuentaMfaService.buscarPorCuenta(ideCuen);

    return {
      success: true,
      habilitado: Boolean(configuracion?.habilitado),
    };
  }

  async verificarMfaLogin(
    mfaToken: string,
    codigo: string,
    navegador?: string,
    ip?: string,
  ) {
    let payload: any;

    try {
      payload = this.jwtService.verify(mfaToken.trim(), {
        secret: this.obtenerMfaChallengeSecret(),
      });
    } catch {
      throw new UnauthorizedException('El desafío MFA es inválido o expiró');
    }

    if (
      payload?.purpose !== 'mfa_login' ||
      !Number.isInteger(Number(payload?.sub))
    ) {
      throw new UnauthorizedException('El desafío MFA no es válido');
    }

    const ideCuen = Number(payload.sub);

    const cuenta = await this.cuentasService.buscarCuentaInterna(ideCuen);

    if (!cuenta || cuenta.estadoCuen !== 'activo') {
      throw new UnauthorizedException('La cuenta no está disponible');
    }

    const ahora = new Date();

    if (cuenta.fechaBloqueoCuen && cuenta.fechaBloqueoCuen > ahora) {
      throw new UnauthorizedException(
        `Cuenta bloqueada hasta ${cuenta.fechaBloqueoCuen.toISOString()}`,
      );
    }

    const resultado = await this.cuentaMfaService.verificarLogin(
      ideCuen,
      codigo,
    );

    if (!resultado.valido) {
      await this.cuentasService.incrementarIntentos(ideCuen);

      const intentos = cuenta.intentosFallidosCuen + 1;

      if (intentos >= this.MAX_INTENTOS) {
        const fechaBloqueo = new Date();

        fechaBloqueo.setMinutes(
          fechaBloqueo.getMinutes() + this.MINUTOS_BLOQUEO,
        );

        await this.cuentasService.bloquearCuenta(ideCuen, fechaBloqueo);

        await this.accesosService.registrarAccesoFallido({
          ideCuen,
          usuario: cuenta.usuarioCuen,
          motivo: 'max_intentos_mfa',
          intentos,
          navegador: navegador?.trim() || 'desconocido',
          ip: this.normalizarIp(ip),
        });

        throw new UnauthorizedException(
          `Cuenta bloqueada hasta ${fechaBloqueo.toISOString()}`,
        );
      }

      await this.accesosService.registrarAccesoFallido({
        ideCuen,
        usuario: cuenta.usuarioCuen,
        motivo: 'codigo_mfa_invalido',
        intentos,
        navegador: navegador?.trim() || 'desconocido',
        ip: this.normalizarIp(ip),
      });

      throw new UnauthorizedException(
        resultado.message || 'El código MFA no es válido',
      );
    }

    const intentosFallidos = Math.max(
      0,
      Number(cuenta.intentosFallidosCuen ?? 0),
    );

    await this.cuentasService.reiniciarIntentos(ideCuen);

    await this.cuentasService.actualizarUltimoLogin(ideCuen);

    return this.login(
      {
        ide_cuen: cuenta.ideCuen,
        usuario_cuen: cuenta.usuarioCuen,
        estado_cuen: cuenta.estadoCuen,
        ide_empl: cuenta.ideEmpl,
        intentos_fallidos: intentosFallidos,
      },
      navegador,
      ip,
    );
  }

  private obtenerRefreshSecret(): string {
    const secret = this.configService.get<string>('JWT_REFRESH_SECRET')?.trim();

    if (!secret) {
      throw new Error('JWT_REFRESH_SECRET es obligatorio');
    }

    return secret;
  }

  private normalizarIp(ip?: string | null): string | null {
    const valor = ip?.trim();

    if (!valor) {
      return null;
    }

    if (valor.startsWith('::ffff:')) {
      return valor.substring(7);
    }

    return valor;
  }
}
