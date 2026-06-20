import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CuentaEntity,
  EmpleadoEntity,
  OpcionesEntity,
  PerfilEntity,
  PerfilOpcionesEntity,
} from '@entities';
import { EntityManager, Repository } from 'typeorm';
import { CreateCuentaDto } from './dto/create_cuenta.dto';
import { FiltroCuentaDto } from './dto/filter_cuenta.dto';
import { UpdateCuentaDto } from './dto/update_cuenta.dto';

@Injectable()
export class CuentasRepository {
  constructor(
    @InjectRepository(CuentaEntity)
    private readonly cuentaRepository: Repository<CuentaEntity>,
    @InjectRepository(EmpleadoEntity)
    private readonly empleadoRepository: Repository<EmpleadoEntity>,
    @InjectRepository(PerfilEntity)
    private readonly perfilRepository: Repository<PerfilEntity>,
  ) {}

  async listar(manager?: EntityManager): Promise<CuentaEntity[]> {
    return this.getCuentaRepository(manager).find({
      relations: {
        empleado: true,
        perfil: true,
      },
      order: {
        usuarioCuen: 'ASC',
      },
    });
  }

  async buscarPorId(
    ideCuen: number,
    manager?: EntityManager,
  ): Promise<CuentaEntity | null> {
    return this.getCuentaRepository(manager).findOne({
      where: {
        ideCuen,
      },
      relations: {
        empleado: true,
        perfil: true,
      },
    });
  }

  async buscarPorUsuario(
    usuarioCuen: string,
    manager?: EntityManager,
  ): Promise<CuentaEntity | null> {
    return this.getCuentaRepository(manager).findOne({
      where: {
        usuarioCuen,
      },
    });
  }

  async filtrar(
    filtros: FiltroCuentaDto,
    manager?: EntityManager,
  ): Promise<CuentaEntity[]> {
    const qb = this.getCuentaRepository(manager)
      .createQueryBuilder('cuenta')
      .leftJoinAndSelect('cuenta.empleado', 'empleado')
      .leftJoinAndSelect('cuenta.perfil', 'perfil')
      .orderBy('cuenta.usuarioCuen', 'ASC');

    if (
      filtros.ideEmpl !== undefined &&
      filtros.ideEmpl !== null &&
      filtros.ideEmpl > 0
    ) {
      qb.andWhere('cuenta.ideEmpl = :ideEmpl', {
        ideEmpl: filtros.ideEmpl,
      });
    }

    if (
      filtros.idePerf !== undefined &&
      filtros.idePerf !== null &&
      filtros.idePerf > 0
    ) {
      qb.andWhere('cuenta.idePerf = :idePerf', {
        idePerf: filtros.idePerf,
      });
    }

    if (filtros.usuarioCuen) {
      qb.andWhere('LOWER(cuenta.usuarioCuen) LIKE LOWER(:usuarioCuen)', {
        usuarioCuen: `%${filtros.usuarioCuen}%`,
      });
    }

    if (filtros.estadoCuen) {
      qb.andWhere('cuenta.estadoCuen = :estadoCuen', {
        estadoCuen: filtros.estadoCuen,
      });
    }

    return qb.getMany();
  }

  async crear(
    dto: CreateCuentaDto,
    passwordHash: string,
    manager?: EntityManager,
  ): Promise<CuentaEntity> {
    const repository = this.getCuentaRepository(manager);

    const cuenta = repository.create({
      ideEmpl: dto.ideEmpl,
      idePerf: dto.idePerf,
      usuarioCuen: dto.usuarioCuen,
      passwordCuen: passwordHash,
      estadoCuen: dto.estadoCuen as CuentaEntity['estadoCuen'],
      usuaIngre: 'admin',
    });

    return repository.save(cuenta);
  }

  async actualizar(
    cuenta: CuentaEntity,
    dto: UpdateCuentaDto,
    passwordHash: string | null,
    manager?: EntityManager,
  ): Promise<CuentaEntity> {
    cuenta.ideEmpl = dto.ideEmpl;
    cuenta.idePerf = dto.idePerf;
    cuenta.usuarioCuen = dto.usuarioCuen;
    cuenta.estadoCuen = dto.estadoCuen as CuentaEntity['estadoCuen'];

    if (passwordHash) {
      cuenta.passwordCuen = passwordHash;
    }

    cuenta.usuaActua = 'admin';
    cuenta.fechaActua = new Date();

    return this.getCuentaRepository(manager).save(cuenta);
  }

  async eliminar(ideCuen: number, manager?: EntityManager): Promise<number> {
    const result = await this.getCuentaRepository(manager).delete({
      ideCuen,
    });

    return result.affected ?? 0;
  }

  async getPerfilPermisos(
    ideCuen: number,
    manager?: EntityManager,
  ): Promise<any[]> {
    return this.getCuentaRepository(manager)
      .createQueryBuilder('cuenta')
      .leftJoin(PerfilEntity, 'perfil', 'perfil.idePerf = cuenta.idePerf')
      .leftJoin(
        PerfilOpcionesEntity,
        'perfilOpcion',
        'perfilOpcion.idePerf = perfil.idePerf',
      )
      .leftJoin(
        OpcionesEntity,
        'opcion',
        'opcion.ideOpci = perfilOpcion.ideOpci',
      )
      .select([
        'cuenta.ideCuen AS ide_cuen',
        'cuenta.ideEmpl AS ide_empl',
        'cuenta.usuarioCuen AS usuario_cuen',
        'cuenta.estadoCuen AS estado_cuen',
        'perfil.nombrePerf AS nombre_perf',
        'opcion.nombreOpci AS nombre_opci',
        'opcion.activoOpci AS activo_opci',
        'perfilOpcion.listar AS listar',
        'perfilOpcion.insertar AS insertar',
        'perfilOpcion.modificar AS modificar',
        'perfilOpcion.eliminar AS eliminar',
        'opcion.rutaOpci AS ruta_opci',
        'opcion.nivelOpci AS nivel_opci',
        'opcion.padreOpci AS padre_opci',
      ])
      .where('cuenta.ideCuen = :ideCuen', { ideCuen })
      .getRawMany();
  }

  async listarEmpleados(manager?: EntityManager): Promise<EmpleadoEntity[]> {
    return this.getEmpleadoRepository(manager).find({
      order: {
        apellidoPaternoEmpl: 'ASC',
        primerNombreEmpl: 'ASC',
      },
    });
  }

  async listarPerfiles(manager?: EntityManager): Promise<PerfilEntity[]> {
    return this.getPerfilRepository(manager).find({
      order: {
        nombrePerf: 'ASC',
      },
    });
  }

  private getCuentaRepository(
    manager?: EntityManager,
  ): Repository<CuentaEntity> {
    if (manager) {
      return manager.getRepository(CuentaEntity);
    }

    return this.cuentaRepository;
  }

  private getEmpleadoRepository(
    manager?: EntityManager,
  ): Repository<EmpleadoEntity> {
    if (manager) {
      return manager.getRepository(EmpleadoEntity);
    }

    return this.empleadoRepository;
  }

  private getPerfilRepository(
    manager?: EntityManager,
  ): Repository<PerfilEntity> {
    if (manager) {
      return manager.getRepository(PerfilEntity);
    }

    return this.perfilRepository;
  }
}
