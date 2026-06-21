import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  ): Promise<IotDispositivoEntity | null> {
    return this.dispositivosRepository.findOne({
      where: { codigoDisp },
    });
  }

  listarDispositivos(): Promise<IotDispositivoEntity[]> {
    return this.dispositivosRepository.find({
      order: { ideDisp: 'ASC' },
    });
  }

  guardarDispositivo(
    data: Partial<IotDispositivoEntity>,
  ): Promise<IotDispositivoEntity> {
    const dispositivo = this.dispositivosRepository.create(data);
    return this.dispositivosRepository.save(dispositivo);
  }

  guardarLectura(data: Partial<IotLecturaEntity>): Promise<IotLecturaEntity> {
    const lectura = this.lecturasRepository.create(data);
    return this.lecturasRepository.save(lectura);
  }

  guardarAlerta(data: Partial<IotAlertaEntity>): Promise<IotAlertaEntity> {
    const alerta = this.alertasRepository.create(data);
    return this.alertasRepository.save(alerta);
  }

  obtenerUltimaLectura(codigoDisp?: string): Promise<IotLecturaEntity | null> {
    const query = this.lecturasRepository
      .createQueryBuilder('lectura')
      .leftJoinAndSelect('lectura.dispositivo', 'dispositivo')
      .orderBy('lectura.fechaLect', 'DESC');

    if (codigoDisp) {
      query.where('dispositivo.codigoDisp = :codigoDisp', { codigoDisp });
    }

    return query.getOne();
  }

  listarLecturas(limit = 50): Promise<IotLecturaEntity[]> {
    return this.lecturasRepository.find({
      relations: { dispositivo: true },
      order: { fechaLect: 'DESC' },
      take: limit,
    });
  }

  listarAlertasAbiertas(): Promise<IotAlertaEntity[]> {
    return this.alertasRepository.find({
      relations: { dispositivo: true, lectura: true },
      where: { estadoAler: 'abierta' },
      order: { fechaAler: 'DESC' },
    });
  }
}
