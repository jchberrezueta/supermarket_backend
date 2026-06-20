import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProveedorEntity } from '@entities';
import { EntityManager, Repository } from 'typeorm';
import { CreateProveedorDTO } from './dto/create_proveedor.dto';
import { FilterProveedorDTO } from './dto/filter_proveedor.dto';
import { UpdateProveedorDTO } from './dto/update_proveedor.dto';

@Injectable()
export class ProveedoresRepository {
  constructor(
    @InjectRepository(ProveedorEntity)
    private readonly proveedorRepository: Repository<ProveedorEntity>,
  ) {}

  async listar(manager?: EntityManager): Promise<ProveedorEntity[]> {
    return this.getRepository(manager).find({
      relations: {
        empresa: true,
      },
      order: {
        apellidoPaternoProv: 'ASC',
        primerNombreProv: 'ASC',
      },
    });
  }

  async buscarPorId(
    ideProv: number,
    manager?: EntityManager,
  ): Promise<ProveedorEntity | null> {
    return this.getRepository(manager).findOne({
      where: {
        ideProv,
      },
      relations: {
        empresa: true,
      },
    });
  }

  async filtrar(
    filtros: FilterProveedorDTO,
    manager?: EntityManager,
  ): Promise<ProveedorEntity[]> {
    const qb = this.getRepository(manager)
      .createQueryBuilder('proveedor')
      .leftJoinAndSelect('proveedor.empresa', 'empresa')
      .orderBy('proveedor.apellidoPaternoProv', 'ASC')
      .addOrderBy('proveedor.primerNombreProv', 'ASC');

    if (filtros.ideEmpr !== undefined && filtros.ideEmpr !== null) {
      qb.andWhere('proveedor.ideEmpr = :ideEmpr', {
        ideEmpr: filtros.ideEmpr,
      });
    }

    if (filtros.cedulaProv) {
      qb.andWhere('proveedor.cedulaProv = :cedulaProv', {
        cedulaProv: filtros.cedulaProv,
      });
    }

    if (filtros.primerNombreProv) {
      qb.andWhere(
        'LOWER(proveedor.primerNombreProv) LIKE LOWER(:primerNombreProv)',
        {
          primerNombreProv: `%${filtros.primerNombreProv}%`,
        },
      );
    }

    if (filtros.apellidoPaternoProv) {
      qb.andWhere(
        'LOWER(proveedor.apellidoPaternoProv) LIKE LOWER(:apellidoPaternoProv)',
        {
          apellidoPaternoProv: `%${filtros.apellidoPaternoProv}%`,
        },
      );
    }

    if (filtros.emailProv) {
      qb.andWhere('LOWER(proveedor.emailProv) LIKE LOWER(:emailProv)', {
        emailProv: `%${filtros.emailProv}%`,
      });
    }

    return qb.getMany();
  }

  async crear(
    dto: CreateProveedorDTO,
    manager?: EntityManager,
  ): Promise<ProveedorEntity> {
    const repository = this.getRepository(manager);

    const proveedor = repository.create({
      ideEmpr: dto.ideEmpr,
      cedulaProv: dto.cedulaProv,
      fechaNacimientoProv: new Date(dto.fechaNacimientoProv),
      edadProv: dto.edadProv,
      telefonoProv: dto.telefonoProv,
      emailProv: dto.emailProv,
      primerNombreProv: dto.primerNombreProv,
      apellidoPaternoProv: dto.apellidoPaternoProv,
      segundoNombreProv: dto.segundoNombreProv ?? null,
      apellidoMaternoProv: dto.apellidoMaternoProv ?? null,
      usuaIngre: 'admin',
    });

    return repository.save(proveedor);
  }

  async actualizar(
    proveedor: ProveedorEntity,
    dto: UpdateProveedorDTO,
    manager?: EntityManager,
  ): Promise<ProveedorEntity> {
    proveedor.ideEmpr = dto.ideEmpr;
    proveedor.cedulaProv = dto.cedulaProv;
    proveedor.fechaNacimientoProv = new Date(dto.fechaNacimientoProv);
    proveedor.edadProv = dto.edadProv;
    proveedor.telefonoProv = dto.telefonoProv;
    proveedor.emailProv = dto.emailProv;
    proveedor.primerNombreProv = dto.primerNombreProv;
    proveedor.apellidoPaternoProv = dto.apellidoPaternoProv;
    proveedor.segundoNombreProv = dto.segundoNombreProv ?? null;
    proveedor.apellidoMaternoProv = dto.apellidoMaternoProv ?? null;
    proveedor.usuaActua = 'admin';
    proveedor.fechaActua = new Date();

    return this.getRepository(manager).save(proveedor);
  }

  async eliminar(ideProv: number, manager?: EntityManager): Promise<number> {
    const result = await this.getRepository(manager).delete({
      ideProv,
    });

    return result.affected ?? 0;
  }

  private getRepository(manager?: EntityManager): Repository<ProveedorEntity> {
    if (manager) {
      return manager.getRepository(ProveedorEntity);
    }

    return this.proveedorRepository;
  }
}
