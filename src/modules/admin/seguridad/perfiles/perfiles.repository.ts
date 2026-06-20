import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PerfilEntity, RolEntity } from '@entities';
import { EntityManager, Repository } from 'typeorm';
import { CreatePerfilDto } from './dto/create_perfil.dto';
import { FilterPerfilDto } from './dto/filter_perfil.dto';
import { UpdatePerfilDto } from './dto/update_perfil.dto';

@Injectable()
export class PerfilesRepository {
  constructor(
    @InjectRepository(PerfilEntity)
    private readonly perfilRepository: Repository<PerfilEntity>,
    @InjectRepository(RolEntity)
    private readonly rolRepository: Repository<RolEntity>,
  ) {}

  async listar(manager?: EntityManager): Promise<PerfilEntity[]> {
    return this.getPerfilRepository(manager).find({
      relations: {
        rol: true,
      },
      order: {
        nombrePerf: 'ASC',
      },
    });
  }

  async buscarPorId(
    idePerf: number,
    manager?: EntityManager,
  ): Promise<PerfilEntity | null> {
    return this.getPerfilRepository(manager).findOne({
      where: {
        idePerf,
      },
      relations: {
        rol: true,
      },
    });
  }

  async filtrar(
    filtros: FilterPerfilDto,
    manager?: EntityManager,
  ): Promise<PerfilEntity[]> {
    const qb = this.getPerfilRepository(manager)
      .createQueryBuilder('perfil')
      .leftJoinAndSelect('perfil.rol', 'rol')
      .orderBy('perfil.nombrePerf', 'ASC');

    if (
      filtros.ideRol !== undefined &&
      filtros.ideRol !== null &&
      filtros.ideRol > 0
    ) {
      qb.andWhere('perfil.ideRol = :ideRol', {
        ideRol: filtros.ideRol,
      });
    }

    if (filtros.nombrePerf) {
      qb.andWhere('LOWER(perfil.nombrePerf) LIKE LOWER(:nombrePerf)', {
        nombrePerf: `%${filtros.nombrePerf}%`,
      });
    }

    if (filtros.descripcionPerf) {
      qb.andWhere(
        'LOWER(perfil.descripcionPerf) LIKE LOWER(:descripcionPerf)',
        {
          descripcionPerf: `%${filtros.descripcionPerf}%`,
        },
      );
    }

    return qb.getMany();
  }

  async crear(
    dto: CreatePerfilDto,
    manager?: EntityManager,
  ): Promise<PerfilEntity> {
    const repository = this.getPerfilRepository(manager);

    const perfil = repository.create({
      ideRol: dto.ideRol,
      nombrePerf: dto.nombrePerf,
      descripcionPerf: dto.descripcionPerf,
      usuaIngre: 'admin',
    });

    return repository.save(perfil);
  }

  async actualizar(
    perfil: PerfilEntity,
    dto: UpdatePerfilDto,
    manager?: EntityManager,
  ): Promise<PerfilEntity> {
    perfil.ideRol = dto.ideRol;
    perfil.nombrePerf = dto.nombrePerf;
    perfil.descripcionPerf = dto.descripcionPerf;
    perfil.usuaActua = 'admin';
    perfil.fechaActua = new Date();

    return this.getPerfilRepository(manager).save(perfil);
  }

  async eliminar(idePerf: number, manager?: EntityManager): Promise<number> {
    const result = await this.getPerfilRepository(manager).delete({
      idePerf,
    });

    return result.affected ?? 0;
  }

  async listarRoles(manager?: EntityManager): Promise<RolEntity[]> {
    return this.getRolRepository(manager).find({
      order: {
        nombreRol: 'ASC',
      },
    });
  }

  private getPerfilRepository(
    manager?: EntityManager,
  ): Repository<PerfilEntity> {
    if (manager) {
      return manager.getRepository(PerfilEntity);
    }

    return this.perfilRepository;
  }

  private getRolRepository(manager?: EntityManager): Repository<RolEntity> {
    if (manager) {
      return manager.getRepository(RolEntity);
    }

    return this.rolRepository;
  }
}
