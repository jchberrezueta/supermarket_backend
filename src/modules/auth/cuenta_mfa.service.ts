import { Injectable } from '@nestjs/common';
import { TOTP } from 'otplib';
import * as QRCode from 'qrcode';
import { CuentaMfaRepository } from './cuenta_mfa.repository';

@Injectable()
export class CuentaMfaService {
  private readonly totp = new TOTP({
    digits: 6,
    period: 30,
  });

  constructor(private readonly repository: CuentaMfaRepository) {}

  async generarConfiguracion(ideCuen: number, usuario: string) {
    const secreto = await this.totp.generateSecret();

    const otpauth = this.totp.toURI({
      secret: secreto,
      issuer: 'Sistema SIG',
      label: usuario,
    });

    const qr = await QRCode.toDataURL(otpauth);

    await this.repository.crear(ideCuen, secreto);

    return {
      qr,
      secreto,
    };
  }

  async validarCodigo(secreto: string, codigo: string) {
    const resultado = await this.totp.verify(codigo, {
      secret: secreto,
    });

    return resultado;
  }

  async activar(ideMfa: number) {
    return this.repository.activar(ideMfa);
  }

  async buscarPorCuenta(ideCuen: number) {
    return this.repository.buscarPorCuenta(ideCuen);
  }

  async actualizarUltimoUso(ideMfa: number) {
    return this.repository.actualizarUltimoUso(ideMfa);
  }

  async confirmarActivacion(ideCuen: number, codigo: string) {
    const mfa = await this.repository.buscarPorCuenta(ideCuen);

    if (!mfa) {
      return {
        success: false,
        message: 'No existe configuración MFA',
      };
    }

    const valido = await this.validarCodigo(mfa.secretoMfa, codigo);

    if (!valido) {
      return {
        success: false,
        message: 'Código MFA incorrecto',
      };
    }

    await this.repository.activar(mfa.ideMfa);

    return {
      success: true,
      message: 'MFA activado correctamente',
    };
  }

  async verificarLogin(ideCuen: number, codigo: string) {
    const mfa = await this.repository.buscarPorCuenta(ideCuen);

    if (!mfa) {
      return {
        valido: false,
        message: 'MFA no configurado',
      };
    }

    if (!mfa.habilitado) {
      return {
        valido: false,
        message: 'MFA no está activo',
      };
    }

    const valido = await this.validarCodigo(mfa.secretoMfa, codigo);

    if (!valido) {
      return {
        valido: false,
        message: 'Código MFA incorrecto',
      };
    }

    await this.repository.actualizarUltimoUso(mfa.ideMfa);

    return {
      valido: true,
    };
  }
}
