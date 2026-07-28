import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { RefreshTokenEntity } from '@entities';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RefreshTokenRepository } from './refresh_token.repository';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,

    private readonly repository: RefreshTokenRepository,
  ) {}

  async guardar(
    ideCuen: number,
    jti: string,
    refreshToken: string,
    ip?: string | null,
    userAgent?: string | null,
    dispositivo?: string | null,
  ): Promise<RefreshTokenEntity> {
    const tokenHash = await bcrypt.hash(refreshToken, 10);

    const entity = new RefreshTokenEntity();

    entity.ideCuen = ideCuen;
    entity.jti = jti;
    entity.tokenHash = tokenHash;
    entity.fechaExpiracion = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    entity.revocado = false;
    entity.ipCreacion = ip?.trim() || null;
    entity.userAgent = userAgent?.trim() || null;
    entity.nombreDispositivo = dispositivo?.trim() || null;
    entity.usuaIngre = 'sistema';
    entity.usuaActua = null;
    entity.fechaActua = null;

    return this.dataSource.transaction((manager) =>
      this.repository.guardar(entity, manager),
    );
  }

  async buscarPorJti(jti: string): Promise<RefreshTokenEntity | null> {
    return this.dataSource.transaction((manager) =>
      this.repository.buscarPorJti(jti, manager),
    );
  }

  async revocar(ideReft: number): Promise<void> {
    await this.dataSource.transaction((manager) =>
      this.repository.revocar(ideReft, manager),
    );
  }

  async revocarTodos(ideCuen: number): Promise<void> {
    await this.dataSource.transaction((manager) =>
      this.repository.revocarTodos(ideCuen, manager),
    );
  }

  async eliminarExpirados(): Promise<void> {
    await this.dataSource.transaction((manager) =>
      this.repository.eliminarExpirados(manager),
    );
  }
}
