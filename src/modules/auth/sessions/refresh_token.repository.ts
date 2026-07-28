import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokenEntity } from '@entities';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class RefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly repository: Repository<RefreshTokenEntity>,
  ) {}

  async guardar(
    refreshToken: RefreshTokenEntity,
    manager?: EntityManager,
  ): Promise<RefreshTokenEntity> {
    return this.getRepository(manager).save(refreshToken);
  }

  async buscarPorJti(
    jti: string,
    manager?: EntityManager,
  ): Promise<RefreshTokenEntity | null> {
    return this.getRepository(manager).findOne({
      where: {
        jti,
        revocado: false,
      },
    });
  }

  async revocar(ideReft: number, manager?: EntityManager): Promise<void> {
    await this.getRepository(manager).update(
      {
        ideReft,
      },
      {
        revocado: true,
        usuaActua: 'sistema',
        fechaActua: new Date(),
      },
    );
  }

  async revocarTodos(ideCuen: number, manager?: EntityManager): Promise<void> {
    await this.getRepository(manager)
      .createQueryBuilder()
      .update(RefreshTokenEntity)
      .set({
        revocado: true,
        usuaActua: 'sistema',
        fechaActua: () => 'CURRENT_TIMESTAMP',
      })
      .where('ide_cuen = :ideCuen', {
        ideCuen,
      })
      .andWhere('revocado = false')
      .execute();
  }

  async eliminarExpirados(manager?: EntityManager): Promise<void> {
    await this.getRepository(manager)
      .createQueryBuilder()
      .delete()
      .from(RefreshTokenEntity)
      .where('fecha_expiracion < CURRENT_TIMESTAMP')
      .execute();
  }

  private getRepository(
    manager?: EntityManager,
  ): Repository<RefreshTokenEntity> {
    if (manager) {
      return manager.getRepository(RefreshTokenEntity);
    }

    return this.repository;
  }
}
