import { BadRequestException, Injectable } from '@nestjs/common';
import { TOTP } from 'otplib';
import * as QRCode from 'qrcode';
import { CuentaMfaRepository } from './cuenta_mfa.repository';
import { MfaCryptoService } from './cuenta_mfa_crypto.service';

@Injectable()
export class CuentaMfaService {
  private readonly totp = new TOTP({
    digits: 6,
    period: 30,
  });

  constructor(
    private readonly repository: CuentaMfaRepository,
    private readonly cryptoService: MfaCryptoService,
  ) {}

  async generarConfiguracion(ideCuen: number, usuario: string) {
    const configuracionActual = await this.repository.buscarPorCuenta(ideCuen);

    if (configuracionActual?.habilitado) {
      throw new BadRequestException('MFA ya está activado para esta cuenta');
    }

    const secreto = await this.totp.generateSecret();

    const otpauth = this.totp.toURI({
      secret: secreto,
      issuer: 'SuperMarket SIG',
      label: usuario,
    });

    const qr = await QRCode.toDataURL(otpauth);

    const secretoCifrado = this.cryptoService.cifrar(secreto);

    await this.repository.guardarConfiguracion(
      ideCuen,
      secretoCifrado,
      usuario,
    );

    return {
      success: true,
      message: 'Configuración MFA generada. Confirme un código para activarla.',
      qr,
      secreto,
    };
  }

  async buscarPorCuenta(ideCuen: number) {
    return this.repository.buscarPorCuenta(ideCuen);
  }

  async confirmarActivacion(
    ideCuen: number,
    codigo: string,
    usuarioResponsable: string,
  ) {
    const mfa = await this.repository.buscarPorCuenta(ideCuen);

    if (!mfa) {
      throw new BadRequestException(
        'Primero debe generar la configuración MFA',
      );
    }

    if (mfa.habilitado) {
      throw new BadRequestException('MFA ya está activado');
    }

    const secreto = this.cryptoService.descifrar(mfa.secretoMfa);

    const valido = await this.validarCodigo(secreto, codigo);

    if (!valido) {
      throw new BadRequestException('El código MFA no es válido');
    }

    await this.repository.activar(mfa.ideMfa, usuarioResponsable);

    return {
      success: true,
      message: 'MFA activado correctamente. Inicie sesión nuevamente.',
    };
  }

  async verificarLogin(
    ideCuen: number,
    codigo: string,
  ): Promise<{
    valido: boolean;
    message?: string;
  }> {
    const mfa = await this.repository.buscarPorCuenta(ideCuen);

    if (!mfa || !mfa.habilitado) {
      return {
        valido: false,
        message: 'MFA no está habilitado para esta cuenta',
      };
    }

    /*
     * Evita aceptar nuevamente un código utilizado
     * durante el mismo periodo de 30 segundos.
     */
    if (
      mfa.fechaUltimoUso &&
      this.perteneceAlPeriodoActual(mfa.fechaUltimoUso)
    ) {
      return {
        valido: false,
        message: 'El código MFA ya fue utilizado',
      };
    }

    const secreto = this.cryptoService.descifrar(mfa.secretoMfa);

    const valido = await this.validarCodigo(secreto, codigo);

    if (!valido) {
      return {
        valido: false,
        message: 'El código MFA no es válido',
      };
    }

    await this.repository.actualizarUltimoUso(mfa.ideMfa);

    return {
      valido: true,
    };
  }

  async desactivar(ideCuen: number, codigo: string) {
    const mfa = await this.repository.buscarPorCuenta(ideCuen);

    if (!mfa || !mfa.habilitado) {
      throw new BadRequestException('MFA no está activado');
    }

    const secreto = this.cryptoService.descifrar(mfa.secretoMfa);

    const valido = await this.validarCodigo(secreto, codigo);

    if (!valido) {
      throw new BadRequestException('El código MFA no es válido');
    }

    await this.repository.eliminarConfiguracion(ideCuen);

    return {
      success: true,
      message: 'MFA desactivado correctamente. Inicie sesión nuevamente.',
    };
  }

  private async validarCodigo(
    secreto: string,
    codigo: string,
  ): Promise<boolean> {
    const resultado = await this.totp.verify(codigo.trim(), {
      secret: secreto,
    });

    return resultado.valid;
  }

  private perteneceAlPeriodoActual(fecha: Date): boolean {
    const periodoMilisegundos = 30_000;

    return (
      Math.floor(fecha.getTime() / periodoMilisegundos) ===
      Math.floor(Date.now() / periodoMilisegundos)
    );
  }
}
