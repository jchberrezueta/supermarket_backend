import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistorialClaveEntity } from '../../database/entities/historial_clave.entity';

@Injectable()
export class HistorialClaveRepository {
  constructor(
    @InjectRepository(HistorialClaveEntity)
    private readonly repository: Repository<HistorialClaveEntity>,
  ) {}

  async guardar(ideCuen: number, passwordHash: string) {
    const registro = this.repository.create({
      ideCuen,
      passwordHash,
      usuaIngre: 'sistema',
    });

    return this.repository.save(registro);
  }

  async obtenerUltimas(ideCuen: number, limite: number = 5) {
    return this.repository.find({
      where: {
        ideCuen,
      },
      order: {
        fechaIngre: 'DESC',
      },
      take: limite,
    });
  }
}
