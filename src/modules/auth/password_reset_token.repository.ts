import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PasswordResetTokenEntity } from '@entities';

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
  ): Promise<PasswordResetTokenEntity> {
    const registro = this.repository.create({
      ideCuen,
      tokenHash,
      fechaExpiracion,
      usado: false,
    });

    return this.repository.save(registro);
  }

  async obtenerActivos(): Promise<PasswordResetTokenEntity[]> {
    return this.repository.find({
      where: {
        usado: false,
      },
    });
  }

  async marcarUsado(idePrt: number): Promise<void> {
    await this.repository.update(
      {
        idePrt,
      },
      {
        usado: true,
      },
    );
  }

  async eliminarExpirados(): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .delete()
      .where('fecha_expiracion < CURRENT_TIMESTAMP')
      .execute();
  }
}
