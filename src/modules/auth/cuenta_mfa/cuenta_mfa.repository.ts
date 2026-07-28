import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CuentaMfaEntity } from '@entities';
import { Repository } from 'typeorm';

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

  async guardarConfiguracion(
    ideCuen: number,
    secretoMfa: string,
    usuarioResponsable: string,
  ): Promise<CuentaMfaEntity> {
    const existente = await this.buscarPorCuenta(ideCuen);

    if (existente) {
      existente.secretoMfa = secretoMfa;
      existente.habilitado = false;
      existente.fechaActivacion = null;
      existente.fechaUltimoUso = null;
      existente.usuaActua = usuarioResponsable;
      existente.fechaActua = new Date();

      return this.repository.save(existente);
    }

    const registro = this.repository.create({
      ideCuen,
      secretoMfa,
      habilitado: false,
      fechaActivacion: null,
      fechaUltimoUso: null,
      usuaIngre: usuarioResponsable,
      usuaActua: null,
      fechaActua: null,
    });

    return this.repository.save(registro);
  }

  async activar(ideMfa: number, usuarioResponsable: string): Promise<void> {
    await this.repository.update(
      {
        ideMfa,
      },
      {
        habilitado: true,
        fechaActivacion: new Date(),
        fechaUltimoUso: null,
        usuaActua: usuarioResponsable,
        fechaActua: new Date(),
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
        usuaActua: 'sistema',
        fechaActua: new Date(),
      },
    );
  }

  async eliminarConfiguracion(ideCuen: number): Promise<void> {
    await this.repository.delete({
      ideCuen,
    });
  }
}
