import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolEntity } from '@entities';
import { EntityManager, Repository } from 'typeorm';
import { CreateRolDTO } from './dto/create_rol.dto';
import { FilterRolDTO } from './dto/filter_rol.dto';
import { UpdateRolDTO } from './dto/update_rol.dto';

@Injectable()
export class RolesRepository {
  constructor(
    @InjectRepository(RolEntity)
    private readonly rolRepository: Repository<RolEntity>,
  ) {}

  async listar(manager?: EntityManager): Promise<RolEntity[]> {
    return this.getRepository(manager).find({
      order: {
        nombreRol: 'ASC',
      },
    });
  }

  async buscarPorId(
    ideRol: number,
    manager?: EntityManager,
  ): Promise<RolEntity | null> {
    return this.getRepository(manager).findOne({
      where: {
        ideRol,
      },
    });
  }

  async filtrar(
    filtros: FilterRolDTO,
    manager?: EntityManager,
  ): Promise<RolEntity[]> {
    const qb = this.getRepository(manager)
      .createQueryBuilder('rol')
      .orderBy('rol.nombreRol', 'ASC');

    if (filtros.nombreRol) {
      qb.andWhere('LOWER(rol.nombreRol) LIKE LOWER(:nombreRol)', {
        nombreRol: `%${filtros.nombreRol}%`,
      });
    }

    if (filtros.descripcionRol) {
      qb.andWhere('LOWER(rol.descripcionRol) LIKE LOWER(:descripcionRol)', {
        descripcionRol: `%${filtros.descripcionRol}%`,
      });
    }

    return qb.getMany();
  }

  async crear(dto: CreateRolDTO, manager?: EntityManager): Promise<RolEntity> {
    const repository = this.getRepository(manager);

    const rol = repository.create({
      nombreRol: dto.nombreRol,
      descripcionRol: dto.descripcionRol,
      usuaIngre: 'admin',
    });

    return repository.save(rol);
  }

  async actualizar(
    rol: RolEntity,
    dto: UpdateRolDTO,
    manager?: EntityManager,
  ): Promise<RolEntity> {
    rol.nombreRol = dto.nombreRol;
    rol.descripcionRol = dto.descripcionRol;
    rol.usuaActua = 'admin';
    rol.fechaActua = new Date();

    return this.getRepository(manager).save(rol);
  }

  async eliminar(ideRol: number, manager?: EntityManager): Promise<number> {
    const result = await this.getRepository(manager).delete({
      ideRol,
    });

    return result.affected ?? 0;
  }

  private getRepository(manager?: EntityManager): Repository<RolEntity> {
    if (manager) {
      return manager.getRepository(RolEntity);
    }

    return this.rolRepository;
  }
}
