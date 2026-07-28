import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccesoUsuarioEntity, CuentaEntity } from '@entities';
import { EntityManager, Repository } from 'typeorm';
import { FilterAccesoUsuarioDto } from './dto/filter_acceso.dto';

export interface RegistrarAccesoData {
  ideCuen: number | null;
  usuarioIntentado: string | null;
  resultadoAcce: 'exitoso' | 'fallido';
  motivoAcce: string | null;
  navegadorAcce: string;
  numIntFallAcce: number;
  ipAcce: string | null;
  latitudAcce?: number | null;
  longitudAcce?: number | null;
  fechaAcce?: Date;
}

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

    if (filtros.ideCuen !== undefined && filtros.ideCuen !== null) {
      qb.andWhere('acceso.ideCuen = :ideCuen', {
        ideCuen: filtros.ideCuen,
      });
    }

    if (filtros.ipAcce) {
      qb.andWhere('acceso.ipAcce LIKE :ipAcce', {
        ipAcce: `%${filtros.ipAcce}%`,
      });
    }

    if (filtros.usuarioCuen) {
      qb.andWhere(
        `
          LOWER(
            COALESCE(
              acceso.usuarioIntentado,
              cuenta.usuarioCuen
            )
          ) LIKE LOWER(:usuarioCuen)
        `,
        {
          usuarioCuen: `%${filtros.usuarioCuen}%`,
        },
      );
    }

    if (filtros.navegadorAcce) {
      qb.andWhere('LOWER(acceso.navegadorAcce) LIKE LOWER(:navegadorAcce)', {
        navegadorAcce: `%${filtros.navegadorAcce}%`,
      });
    }

    if (filtros.resultadoAcce) {
      qb.andWhere('acceso.resultadoAcce = :resultadoAcce', {
        resultadoAcce: filtros.resultadoAcce,
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
    data: RegistrarAccesoData,
    manager?: EntityManager,
  ): Promise<AccesoUsuarioEntity> {
    const repository = this.getAccesoRepository(manager);

    const acceso = repository.create({
      ideCuen: data.ideCuen,
      usuarioIntentado: data.usuarioIntentado?.trim().toLowerCase() || null,
      resultadoAcce: data.resultadoAcce,
      motivoAcce: data.motivoAcce?.trim() || null,
      navegadorAcce: data.navegadorAcce?.trim() || 'desconocido',
      fechaAcce: data.fechaAcce ?? new Date(),
      numIntFallAcce: Math.max(0, data.numIntFallAcce),
      ipAcce: data.ipAcce?.trim() || null,
      latitudAcce:
        data.latitudAcce !== null && data.latitudAcce !== undefined
          ? String(data.latitudAcce)
          : null,
      longitudAcce:
        data.longitudAcce !== null && data.longitudAcce !== undefined
          ? String(data.longitudAcce)
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
