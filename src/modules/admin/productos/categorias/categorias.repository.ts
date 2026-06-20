import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriaEntity } from '@entities';
import { EntityManager, Repository } from 'typeorm';
import { CreateCategoriaDTO } from './dto/create_categoria.dto';
import { FilterCategoriaDTO } from './dto/filter_categoria.dto';
import { UpdateCategoriaDTO } from './dto/update_categoria.dto';

@Injectable()
export class CategoriasRepository {
  constructor(
    @InjectRepository(CategoriaEntity)
    private readonly categoriaRepository: Repository<CategoriaEntity>,
  ) {}

  async listar(manager?: EntityManager): Promise<CategoriaEntity[]> {
    return this.getRepository(manager).find({
      order: {
        nombreCate: 'ASC',
      },
    });
  }

  async buscarPorId(
    ideCate: number,
    manager?: EntityManager,
  ): Promise<CategoriaEntity | null> {
    return this.getRepository(manager).findOne({
      where: {
        ideCate,
      },
    });
  }

  async filtrar(
    filtros: FilterCategoriaDTO,
    manager?: EntityManager,
  ): Promise<CategoriaEntity[]> {
    const qb = this.getRepository(manager)
      .createQueryBuilder('categoria')
      .orderBy('categoria.nombreCate', 'ASC');

    if (filtros.nombreCate) {
      qb.andWhere('LOWER(categoria.nombreCate) LIKE LOWER(:nombreCate)', {
        nombreCate: `%${filtros.nombreCate}%`,
      });
    }

    if (filtros.descripcionCate) {
      qb.andWhere(
        'LOWER(categoria.descripcionCate) LIKE LOWER(:descripcionCate)',
        {
          descripcionCate: `%${filtros.descripcionCate}%`,
        },
      );
    }

    return qb.getMany();
  }

  async crear(
    dto: CreateCategoriaDTO,
    manager?: EntityManager,
  ): Promise<CategoriaEntity> {
    const repository = this.getRepository(manager);

    const categoria = repository.create({
      nombreCate: dto.nombreCate,
      descripcionCate: dto.descripcionCate,
      usuaIngre: 'admin',
    });

    return repository.save(categoria);
  }

  async actualizar(
    categoria: CategoriaEntity,
    dto: UpdateCategoriaDTO,
    manager?: EntityManager,
  ): Promise<CategoriaEntity> {
    categoria.nombreCate = dto.nombreCate;
    categoria.descripcionCate = dto.descripcionCate;
    categoria.usuaActua = 'admin';
    categoria.fechaActua = new Date();

    return this.getRepository(manager).save(categoria);
  }

  async eliminar(ideCate: number, manager?: EntityManager): Promise<number> {
    const result = await this.getRepository(manager).delete({
      ideCate,
    });

    return result.affected ?? 0;
  }

  private getRepository(manager?: EntityManager): Repository<CategoriaEntity> {
    if (manager) {
      return manager.getRepository(CategoriaEntity);
    }

    return this.categoriaRepository;
  }
}
