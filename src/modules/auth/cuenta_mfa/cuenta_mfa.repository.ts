import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CuentaMfaEntity } from '@entities';

@Injectable()
export class CuentaMfaRepository {
  constructor(
    @InjectRepository(CuentaMfaEntity)
    private readonly repository: Repository<CuentaMfaEntity>,
  ) {}

  async buscarPorCuenta(ideCuen: number): Promise<CuentaMfaEntity | null> {
    return this.repository.findOne({
      where: {
        ideCuen,
      },
    });
  }

  async crear(ideCuen: number, secretoMfa: string): Promise<CuentaMfaEntity> {
    const registro = this.repository.create({
      ideCuen,
      secretoMfa,
      habilitado: false,
    });

    return this.repository.save(registro);
  }

  async activar(ideMfa: number): Promise<void> {
    await this.repository.update(
      {
        ideMfa,
      },
      {
        habilitado: true,
        fechaActivacion: new Date(),
      },
    );
  }

  async desactivar(ideCuen: number): Promise<void> {
    await this.repository.update(
      {
        ideCuen,
      },
      {
        habilitado: false,
      },
    );
  }

  async actualizarUltimoUso(ideMfa: number): Promise<void> {
    await this.repository.update(
      {
        ideMfa,
      },
      {
        fechaUltimoUso: new Date(),
      },
    );
  }

  async eliminarConfiguracion(ideCuen: number): Promise<void> {
    await this.repository.delete({
      ideCuen,
    });
  }
}
