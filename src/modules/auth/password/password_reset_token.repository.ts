import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordResetTokenEntity } from '@entities';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class PasswordResetTokenRepository {
  constructor(
    @InjectRepository(PasswordResetTokenEntity)
    private readonly repository: Repository<PasswordResetTokenEntity>,
  ) {}

  async crear(
    ideCuen: number,
    tokenHash: string,
    fechaExpiracion: Date,
    ipSolicitud?: string | null,
    manager?: EntityManager,
  ): Promise<PasswordResetTokenEntity> {
    const repository = this.getRepository(manager);

    const registro = repository.create({
      ideCuen,
      tokenHash,
      fechaExpiracion,
      utilizado: false,
      ipSolicitud: ipSolicitud?.trim() || null,
      usuaIngre: 'sistema',
      usuaActua: null,
      fechaActua: null,
    });

    return repository.save(registro);
  }

  async buscarPorHash(
    tokenHash: string,
    manager?: EntityManager,
  ): Promise<PasswordResetTokenEntity | null> {
    return this.getRepository(manager).findOne({
      where: {
        tokenHash,
        utilizado: false,
      },
    });
  }

  async marcarUsado(idePrt: number, manager?: EntityManager): Promise<void> {
    await this.getRepository(manager).update(
      {
        idePrt,
      },
      {
        utilizado: true,
        usuaActua: 'sistema',
        fechaActua: new Date(),
      },
    );
  }

  async invalidarActivosPorCuenta(
    ideCuen: number,
    manager?: EntityManager,
  ): Promise<void> {
    await this.getRepository(manager)
      .createQueryBuilder()
      .update(PasswordResetTokenEntity)
      .set({
        utilizado: true,
        usuaActua: 'sistema',
        fechaActua: () => 'CURRENT_TIMESTAMP',
      })
      .where('ide_cuen = :ideCuen', {
        ideCuen,
      })
      .andWhere('utilizado = false')
      .execute();
  }

  async eliminarExpirados(manager?: EntityManager): Promise<void> {
    await this.getRepository(manager)
      .createQueryBuilder()
      .delete()
      .from(PasswordResetTokenEntity)
      .where('fecha_expiracion < CURRENT_TIMESTAMP')
      .execute();
  }

  private getRepository(
    manager?: EntityManager,
  ): Repository<PasswordResetTokenEntity> {
    if (manager) {
      return manager.getRepository(PasswordResetTokenEntity);
    }

    return this.repository;
  }
}
