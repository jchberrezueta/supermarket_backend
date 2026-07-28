import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

@Injectable()
export class MfaCryptoService {
  constructor(private readonly configService: ConfigService) {}

  cifrar(textoPlano: string): string {
    const clave = this.obtenerClave();
    const iv = randomBytes(12);

    const cipher = createCipheriv('aes-256-gcm', clave, iv);

    const contenidoCifrado = Buffer.concat([
      cipher.update(textoPlano, 'utf8'),
      cipher.final(),
    ]);

    const etiqueta = cipher.getAuthTag();

    return [
      'v1',
      iv.toString('base64url'),
      etiqueta.toString('base64url'),
      contenidoCifrado.toString('base64url'),
    ].join('.');
  }

  descifrar(valorCifrado: string): string {
    try {
      const partes = valorCifrado.split('.');

      if (partes.length !== 4 || partes[0] !== 'v1') {
        throw new Error('Formato de secreto MFA inválido');
      }

      const [, ivTexto, etiquetaTexto, contenidoTexto] = partes;

      const decipher = createDecipheriv(
        'aes-256-gcm',
        this.obtenerClave(),
        Buffer.from(ivTexto, 'base64url'),
      );

      decipher.setAuthTag(Buffer.from(etiquetaTexto, 'base64url'));

      const contenido = Buffer.concat([
        decipher.update(Buffer.from(contenidoTexto, 'base64url')),
        decipher.final(),
      ]);

      return contenido.toString('utf8');
    } catch {
      throw new InternalServerErrorException(
        'No fue posible procesar la configuración MFA',
      );
    }
  }

  private obtenerClave(): Buffer {
    const claveHexadecimal = this.configService
      .get<string>('MFA_ENCRYPTION_KEY')
      ?.trim();

    if (!claveHexadecimal || !/^[a-fA-F0-9]{64}$/.test(claveHexadecimal)) {
      throw new InternalServerErrorException(
        'MFA_ENCRYPTION_KEY debe contener exactamente 64 caracteres hexadecimales',
      );
    }

    return Buffer.from(claveHexadecimal, 'hex');
  }
}
