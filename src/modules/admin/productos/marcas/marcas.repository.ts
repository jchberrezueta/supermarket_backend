import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MarcaEntity } from '@entities';
import { EntityManager, Repository } from 'typeorm';
import { CreateMarcaDTO } from './dto/create_marca.dto';
import { FilterMarcaDTO } from './dto/filter_marca.dto';
import { UpdateMarcaDTO } from './dto/update_marca.dto';

@Injectable()
export class MarcasRepository {
  constructor(
    @InjectRepository(MarcaEntity)
    private readonly marcaRepository: Repository<MarcaEntity>,
  ) {}

  async listar(manager?: EntityManager): Promise<MarcaEntity[]> {
    return this.getRepository(manager).find({
      order: {
        nombreMarc: 'ASC',
      },
    });
  }

  async buscarPorId(
    ideMarc: number,
    manager?: EntityManager,
  ): Promise<MarcaEntity | null> {
    return this.getRepository(manager).findOne({
      where: {
        ideMarc,
      },
    });
  }

  async filtrar(
    filtros: FilterMarcaDTO,
    manager?: EntityManager,
  ): Promise<MarcaEntity[]> {
    const qb = this.getRepository(manager)
      .createQueryBuilder('marca')
      .orderBy('marca.nombreMarc', 'ASC');

    if (filtros.nombreMarc) {
      qb.andWhere('LOWER(marca.nombreMarc) LIKE LOWER(:nombreMarc)', {
        nombreMarc: `%${filtros.nombreMarc}%`,
      });
    }

    if (filtros.paisOrigenMarc) {
      qb.andWhere('LOWER(marca.paisOrigenMarc) LIKE LOWER(:paisOrigenMarc)', {
        paisOrigenMarc: `%${filtros.paisOrigenMarc}%`,
      });
    }

    if (filtros.calidadMarc !== undefined && filtros.calidadMarc !== null) {
      qb.andWhere('marca.calidadMarc = :calidadMarc', {
        calidadMarc: filtros.calidadMarc,
      });
    }

    return qb.getMany();
  }

  async crear(
    dto: CreateMarcaDTO,
    manager?: EntityManager,
  ): Promise<MarcaEntity> {
    const repository = this.getRepository(manager);

    const marca = repository.create({
      nombreMarc: dto.nombreMarc,
      paisOrigenMarc: dto.paisOrigenMarc,
      calidadMarc: dto.calidadMarc,
      descripcionMarc: dto.descripcionMarc,
      usuaIngre: 'admin',
    });

    return repository.save(marca);
  }

  async actualizar(
    marca: MarcaEntity,
    dto: UpdateMarcaDTO,
    manager?: EntityManager,
  ): Promise<MarcaEntity> {
    marca.nombreMarc = dto.nombreMarc;
    marca.paisOrigenMarc = dto.paisOrigenMarc;
    marca.calidadMarc = dto.calidadMarc;
    marca.descripcionMarc = dto.descripcionMarc;
    marca.usuaActua = 'admin';
    marca.fechaActua = new Date();

    return this.getRepository(manager).save(marca);
  }

  async eliminar(ideMarc: number, manager?: EntityManager): Promise<number> {
    const result = await this.getRepository(manager).delete({
      ideMarc,
    });

    return result.affected ?? 0;
  }

  private getRepository(manager?: EntityManager): Repository<MarcaEntity> {
    if (manager) {
      return manager.getRepository(MarcaEntity);
    }

    return this.marcaRepository;
  }
}
