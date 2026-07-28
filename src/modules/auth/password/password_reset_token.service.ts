import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { createHash, randomBytes } from 'crypto';
import { DataSource } from 'typeorm';
import { PasswordResetTokenRepository } from './password_reset_token.repository';

@Injectable()
export class PasswordResetTokenService {
  constructor(
    private readonly repository: PasswordResetTokenRepository,

    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  calcularHash(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  async generar(
    ideCuen: number,
    fechaExpiracion: Date,
    ipSolicitud?: string | null,
  ): Promise<string> {
    const token = randomBytes(32).toString('base64url');
    const tokenHash = this.calcularHash(token);

    await this.dataSource.transaction(async (manager) => {
      await this.repository.invalidarActivosPorCuenta(ideCuen, manager);

      await this.repository.crear(
        ideCuen,
        tokenHash,
        fechaExpiracion,
        ipSolicitud,
        manager,
      );
    });

    return token;
  }

  async buscarValido(token: string) {
    if (!token?.trim()) {
      return null;
    }

    const tokenHash = this.calcularHash(token.trim());

    const registro = await this.repository.buscarPorHash(tokenHash);

    if (!registro) {
      return null;
    }

    if (registro.fechaExpiracion <= new Date()) {
      return null;
    }

    return registro;
  }

  async invalidarActivosPorCuenta(ideCuen: number): Promise<void> {
    await this.repository.invalidarActivosPorCuenta(ideCuen);
  }
}
