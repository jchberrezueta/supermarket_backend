import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OpcionesEntity } from '@entities';
import { EntityManager, Repository } from 'typeorm';
import { CreateOpcionDto } from './dto/create_opcion.dto';
import { FilterOpcionDto } from './dto/filter_opcion.dto';
import { UpdateOpcionDto } from './dto/update_opcion.dto';

@Injectable()
export class OpcionesRepository {
  constructor(
    @InjectRepository(OpcionesEntity)
    private readonly opcionesRepository: Repository<OpcionesEntity>,
  ) {}

  async listar(manager?: EntityManager): Promise<OpcionesEntity[]> {
    return this.getRepository(manager).find({
      order: {
        nombreOpci: 'ASC',
      },
    });
  }

  async buscarPorId(
    ideOpci: number,
    manager?: EntityManager,
  ): Promise<OpcionesEntity | null> {
    return this.getRepository(manager).findOne({
      where: {
        ideOpci,
      },
    });
  }

  async filtrar(
    filtros: FilterOpcionDto,
    manager?: EntityManager,
  ): Promise<OpcionesEntity[]> {
    const qb = this.getRepository(manager)
      .createQueryBuilder('opcion')
      .orderBy('opcion.nombreOpci', 'ASC');

    if (filtros.nombreOpci) {
      qb.andWhere('LOWER(opcion.nombreOpci) LIKE LOWER(:nombreOpci)', {
        nombreOpci: `%${filtros.nombreOpci}%`,
      });
    }

    if (filtros.rutaOpci) {
      qb.andWhere('LOWER(opcion.rutaOpci) LIKE LOWER(:rutaOpci)', {
        rutaOpci: `%${filtros.rutaOpci}%`,
      });
    }

    if (filtros.activoOpci) {
      qb.andWhere('opcion.activoOpci = :activoOpci', {
        activoOpci: filtros.activoOpci,
      });
    }

    return qb.getMany();
  }

  async crear(
    dto: CreateOpcionDto,
    manager?: EntityManager,
  ): Promise<OpcionesEntity> {
    const repository = this.getRepository(manager);

    const opcion = repository.create({
      nombreOpci: dto.nombreOpci,
      rutaOpci: dto.rutaOpci,
      activoOpci: dto.activoOpci as OpcionesEntity['activoOpci'],
      descripcionOpci: dto.descripcionOpci,
      nivelOpci: dto.nivelOpci,
      padreOpci: dto.padreOpci ?? null,
      iconoOpci: dto.iconoOpci ?? null,
      usuaIngre: 'admin',
    });

    return repository.save(opcion);
  }

  async actualizar(
    opcion: OpcionesEntity,
    dto: UpdateOpcionDto,
    manager?: EntityManager,
  ): Promise<OpcionesEntity> {
    opcion.nombreOpci = dto.nombreOpci;
    opcion.rutaOpci = dto.rutaOpci;
    opcion.activoOpci = dto.activoOpci as OpcionesEntity['activoOpci'];
    opcion.descripcionOpci = dto.descripcionOpci;
    opcion.nivelOpci = dto.nivelOpci;
    opcion.padreOpci = dto.padreOpci ?? null;
    opcion.iconoOpci = dto.iconoOpci ?? null;
    opcion.usuaActua = 'admin';
    opcion.fechaActua = new Date();

    return this.getRepository(manager).save(opcion);
  }

  async eliminar(ideOpci: number, manager?: EntityManager): Promise<number> {
    const result = await this.getRepository(manager).delete({
      ideOpci,
    });

    return result.affected ?? 0;
  }

  private getRepository(manager?: EntityManager): Repository<OpcionesEntity> {
    if (manager) {
      return manager.getRepository(OpcionesEntity);
    }

    return this.opcionesRepository;
  }
}
