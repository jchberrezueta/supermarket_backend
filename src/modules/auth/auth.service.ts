import { Injectable } from '@nestjs/common';
import { CuentasService } from '../admin/seguridad/cuentas/cuentas.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

type ValidateResult =
  | {
      success: true;
      user: any;
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

    await this.cuentasService.reiniciarIntentos(user.ide_cuen);

    await this.cuentasService.actualizarUltimoLogin(user.ide_cuen);

    const dataUser = { ...user };
    delete dataUser.password_cuen;

    return {
      success: true,
      user: dataUser,
    };
  }

  async login(user: any) {
    const info = await this.cuentasService.getPerfilPermisos(user.ide_cuen);

    if (!info.length) {
      throw new Error('La cuenta no tiene permisos configurados');
    }

    const rutasSidebar = await this.cuentasService.getSidebarRutas(
      user.ide_cuen,
    );
    const permisosUsuario = info.map((p) => ({
      ruta: p.ruta_opci,
      listar: p.listar === 'si',
      insertar: p.insertar === 'si',
      modificar: p.modificar === 'si',
      eliminar: p.eliminar === 'si',
      activo: p.activo_opci === 'si',
      nombre: p.nombre_opci,
      nivel: p.nivel_opci,
      padre: p.padre_opci,
    }));
    const payload = {
      sub: info[0].ide_cuen,
      username: info[0].usuario_cuen,
      state: info[0].estado_cuen,
      perfil: info[0].nombre_perf,
      ideEmpl: info[0].ide_empl,
      permisos: permisosUsuario,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: payload.sub,
        username: payload.username,
        state: payload.state,
        perfil: payload.perfil,
        permisos: payload.permisos,
        ideEmpl: payload.ideEmpl,
        rutas_sidebar: rutasSidebar,
      },
    };
  }
}
