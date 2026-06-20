import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccesoUsuarioEntity, CuentaEntity } from '@entities';
import { EntityManager, Repository } from 'typeorm';
import { CreateAccesoUsuarioDto } from './dto/create_acceso.dto';
import { FilterAccesoUsuarioDto } from './dto/filter_acceso.dto';

@Injectable()
export class AccesosRepository {
  constructor(
    @InjectRepository(AccesoUsuarioEntity)
    private readonly accesoRepository: Repository<AccesoUsuarioEntity>,
    @InjectRepository(CuentaEntity)
    private readonly cuentaRepository: Repository<CuentaEntity>,
  ) {}

  async listar(manager?: EntityManager): Promise<AccesoUsuarioEntity[]> {
    return this.getAccesoRepository(manager).find({
      relations: {
        cuenta: true,
      },
      order: {
        fechaAcce: 'DESC',
        ideAcce: 'DESC',
      },
    });
  }

  async buscarPorId(
    ideAcce: number,
    manager?: EntityManager,
  ): Promise<AccesoUsuarioEntity | null> {
    return this.getAccesoRepository(manager).findOne({
      where: {
        ideAcce,
      },
      relations: {
        cuenta: true,
      },
    });
  }

  async filtrar(
    filtros: FilterAccesoUsuarioDto,
    manager?: EntityManager,
  ): Promise<AccesoUsuarioEntity[]> {
    const qb = this.getAccesoRepository(manager)
      .createQueryBuilder('acceso')
      .leftJoinAndSelect('acceso.cuenta', 'cuenta')
      .orderBy('acceso.fechaAcce', 'DESC')
      .addOrderBy('acceso.ideAcce', 'DESC');

    if (
      filtros.ideCuen !== undefined &&
      filtros.ideCuen !== null &&
      filtros.ideCuen > 0
    ) {
      qb.andWhere('acceso.ideCuen = :ideCuen', {
        ideCuen: filtros.ideCuen,
      });
    }

    if (filtros.ipAcce) {
      qb.andWhere('acceso.ipAcce = :ipAcce', {
        ipAcce: filtros.ipAcce,
      });
    }

    if (filtros.navegadorAcce) {
      qb.andWhere('LOWER(acceso.navegadorAcce) LIKE LOWER(:navegadorAcce)', {
        navegadorAcce: `%${filtros.navegadorAcce}%`,
      });
    }

    if (filtros.fechaAcceDesde) {
      qb.andWhere('acceso.fechaAcce >= :fechaAcceDesde', {
        fechaAcceDesde: filtros.fechaAcceDesde,
      });
    }

    if (filtros.fechaAcceHasta) {
      qb.andWhere('acceso.fechaAcce <= :fechaAcceHasta', {
        fechaAcceHasta: filtros.fechaAcceHasta,
      });
    }

    return qb.getMany();
  }

  async crear(
    dto: CreateAccesoUsuarioDto,
    manager?: EntityManager,
  ): Promise<AccesoUsuarioEntity> {
    const repository = this.getAccesoRepository(manager);

    const acceso = repository.create({
      ideCuen: dto.ideCuen,
      navegadorAcce: dto.navegadorAcce,
      fechaAcce: dto.fechaAcce ? new Date(dto.fechaAcce) : new Date(),
      numIntFallAcce: dto.numIntFallAcce ?? 0,
      ipAcce: dto.ipAcce ?? '999.999.999.999',
      latitudAcce:
        dto.latitudAcce !== null && dto.latitudAcce !== undefined
          ? String(dto.latitudAcce)
          : null,
      longitudAcce:
        dto.longitudAcce !== null && dto.longitudAcce !== undefined
          ? String(dto.longitudAcce)
          : null,
    });

    return repository.save(acceso);
  }

  async listarCuentas(manager?: EntityManager): Promise<CuentaEntity[]> {
    return this.getCuentaRepository(manager).find({
      order: {
        usuarioCuen: 'ASC',
      },
    });
  }

  private getAccesoRepository(
    manager?: EntityManager,
  ): Repository<AccesoUsuarioEntity> {
    if (manager) {
      return manager.getRepository(AccesoUsuarioEntity);
    }

    return this.accesoRepository;
  }

  private getCuentaRepository(
    manager?: EntityManager,
  ): Repository<CuentaEntity> {
    if (manager) {
      return manager.getRepository(CuentaEntity);
    }

    return this.cuentaRepository;
  }
}
