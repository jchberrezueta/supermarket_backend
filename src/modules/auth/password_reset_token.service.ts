import { Injectable } from '@nestjs/common';
import { PasswordResetTokenRepository } from './password_reset_token.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordResetTokenService {
  constructor(private readonly repository: PasswordResetTokenRepository) {}

  async guardar(ideCuen: number, token: string, expiracion: Date) {
    const tokenHash = await bcrypt.hash(token, 10);

    return this.repository.crear(ideCuen, tokenHash, expiracion);
  }

  async validar(token: string) {
    const registros = await this.repository.obtenerActivos();

    for (const registro of registros) {
      const coincide = await bcrypt.compare(token, registro.tokenHash);

      if (coincide) {
        return registro;
      }
    }

    return null;
  }

  async usar(idePrt: number) {
    return this.repository.marcarUsado(idePrt);
  }
}
