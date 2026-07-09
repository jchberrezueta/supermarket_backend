import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { IotAlertaEntity } from '../../../database/entities/iot_alerta.entity';
import { IotDispositivoEntity } from '../../../database/entities/iot_dispositivo.entity';
import { IotLecturaEntity } from '../../../database/entities/iot_lectura.entity';

@Injectable()
export class IotRepository {
  constructor(
    @InjectRepository(IotDispositivoEntity)
    private readonly dispositivosRepository: Repository<IotDispositivoEntity>,

    @InjectRepository(IotLecturaEntity)
    private readonly lecturasRepository: Repository<IotLecturaEntity>,

    @InjectRepository(IotAlertaEntity)
    private readonly alertasRepository: Repository<IotAlertaEntity>,
  ) {}

  buscarDispositivoPorCodigo(
    codigoDisp: string,
    manager?: EntityManager,
  ): Promise<IotDispositivoEntity | null> {
    return this.getDispositivoRepository(manager).findOne({
      where: { codigoDisp },
    });
  }

  listarDispositivos(manager?: EntityManager): Promise<IotDispositivoEntity[]> {
    return this.getDispositivoRepository(manager).find({
      order: { ideDisp: 'ASC' },
    });
  }

  guardarDispositivo(
    data: Partial<IotDispositivoEntity>,
    manager?: EntityManager,
  ): Promise<IotDispositivoEntity> {
    const repository = this.getDispositivoRepository(manager);
    const dispositivo = repository.create(data);

    return repository.save(dispositivo);
  }

  guardarLectura(
    data: Partial<IotLecturaEntity>,
    manager?: EntityManager,
  ): Promise<IotLecturaEntity> {
    const repository = this.getLecturaRepository(manager);
    const lectura = repository.create(data);

    return repository.save(lectura);
  }

  guardarAlerta(
    data: Partial<IotAlertaEntity>,
    manager?: EntityManager,
  ): Promise<IotAlertaEntity> {
    const repository = this.getAlertaRepository(manager);
    const alerta = repository.create(data);

    return repository.save(alerta);
  }

  obtenerUltimaLectura(
    codigoDisp?: string,
    manager?: EntityManager,
  ): Promise<IotLecturaEntity | null> {
    const query = this.getLecturaRepository(manager)
      .createQueryBuilder('lectura')
      .leftJoinAndSelect('lectura.dispositivo', 'dispositivo')
      .orderBy('lectura.fechaLect', 'DESC');

    if (codigoDisp) {
      query.where('dispositivo.codigoDisp = :codigoDisp', { codigoDisp });
    }

    return query.getOne();
  }

  listarLecturas(
    limit = 50,
    manager?: EntityManager,
  ): Promise<IotLecturaEntity[]> {
    return this.getLecturaRepository(manager).find({
      relations: { dispositivo: true },
      order: { fechaLect: 'DESC' },
      take: limit,
    });
  }

  buscarAlertaAbiertaPorTipo(
    ideDisp: number,
    tipoAler: string,
    manager?: EntityManager,
  ): Promise<IotAlertaEntity | null> {
    return this.getAlertaRepository(manager).findOne({
      where: {
        ideDisp,
        tipoAler,
        estadoAler: 'abierta',
      },
      order: {
        fechaAler: 'DESC',
      },
    });
  }

  listarAlertasAbiertas(manager?: EntityManager): Promise<IotAlertaEntity[]> {
    return this.getAlertaRepository(manager).find({
      relations: { dispositivo: true, lectura: true },
      where: { estadoAler: 'abierta' },
      order: { fechaAler: 'DESC' },
    });
  }

  private getDispositivoRepository(
    manager?: EntityManager,
  ): Repository<IotDispositivoEntity> {
    if (manager) {
      return manager.getRepository(IotDispositivoEntity);
    }

    return this.dispositivosRepository;
  }

  private getLecturaRepository(
    manager?: EntityManager,
  ): Repository<IotLecturaEntity> {
    if (manager) {
      return manager.getRepository(IotLecturaEntity);
    }

    return this.lecturasRepository;
  }

  private getAlertaRepository(
    manager?: EntityManager,
  ): Repository<IotAlertaEntity> {
    if (manager) {
      return manager.getRepository(IotAlertaEntity);
    }

    return this.alertasRepository;
  }
}
