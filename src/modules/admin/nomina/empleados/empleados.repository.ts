import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmpleadoEntity, RolEntity } from '@entities';
import { EntityManager, Repository } from 'typeorm';
import { MoneyUtil } from '@common/utils/money.util';
import { CreateEmpleadoDTO } from './dto/create_empleado.dto';
import { FilterEmpleadoDTO } from './dto/filter_empleado.dto';
import { UpdateEmpleadoDTO } from './dto/update_empleado.dto';

@Injectable()
export class EmpleadosRepository {
  constructor(
    @InjectRepository(EmpleadoEntity)
    private readonly empleadoRepository: Repository<EmpleadoEntity>,
    @InjectRepository(RolEntity)
    private readonly rolRepository: Repository<RolEntity>,
  ) {}

  async listar(manager?: EntityManager): Promise<EmpleadoEntity[]> {
    return this.getEmpleadoRepository(manager).find({
      relations: {
        rol: true,
      },
      order: {
        apellidoPaternoEmpl: 'ASC',
        primerNombreEmpl: 'ASC',
      },
    });
  }

  async buscarPorId(
    ideEmpl: number,
    manager?: EntityManager,
  ): Promise<EmpleadoEntity | null> {
    return this.getEmpleadoRepository(manager).findOne({
      where: {
        ideEmpl,
      },
      relations: {
        rol: true,
      },
    });
  }

  async filtrar(
    filtros: FilterEmpleadoDTO,
    manager?: EntityManager,
  ): Promise<EmpleadoEntity[]> {
    const qb = this.getEmpleadoRepository(manager)
      .createQueryBuilder('empleado')
      .leftJoinAndSelect('empleado.rol', 'rol')
      .orderBy('empleado.apellidoPaternoEmpl', 'ASC')
      .addOrderBy('empleado.primerNombreEmpl', 'ASC');

    if (
      filtros.ideRol !== undefined &&
      filtros.ideRol !== null &&
      filtros.ideRol > 0
    ) {
      qb.andWhere('empleado.ideRol = :ideRol', {
        ideRol: filtros.ideRol,
      });
    }

    if (filtros.cedulaEmpl) {
      qb.andWhere('empleado.cedulaEmpl = :cedulaEmpl', {
        cedulaEmpl: filtros.cedulaEmpl,
      });
    }

    if (filtros.primerNombreEmpl) {
      qb.andWhere(
        'LOWER(empleado.primerNombreEmpl) LIKE LOWER(:primerNombreEmpl)',
        {
          primerNombreEmpl: `%${filtros.primerNombreEmpl}%`,
        },
      );
    }

    if (filtros.apellidoPaternoEmpl) {
      qb.andWhere(
        'LOWER(empleado.apellidoPaternoEmpl) LIKE LOWER(:apellidoPaternoEmpl)',
        {
          apellidoPaternoEmpl: `%${filtros.apellidoPaternoEmpl}%`,
        },
      );
    }

    if (filtros.tituloEmpl) {
      qb.andWhere('LOWER(empleado.tituloEmpl) LIKE LOWER(:tituloEmpl)', {
        tituloEmpl: `%${filtros.tituloEmpl}%`,
      });
    }

    if (filtros.estadoEmpl) {
      qb.andWhere('empleado.estadoEmpl = :estadoEmpl', {
        estadoEmpl: filtros.estadoEmpl,
      });
    }

    return qb.getMany();
  }

  async crear(
    dto: CreateEmpleadoDTO,
    manager?: EntityManager,
  ): Promise<EmpleadoEntity> {
    const repository = this.getEmpleadoRepository(manager);

    const empleado = repository.create({
      ideRol: dto.ideRol,
      cedulaEmpl: dto.cedulaEmpl,
      fechaNacimientoEmpl: new Date(dto.fechaNacimientoEmpl),
      edadEmpl: dto.edadEmpl,
      fechaInicioEmpl: new Date(dto.fechaInicioEmpl),
      primerNombreEmpl: dto.primerNombreEmpl,
      apellidoPaternoEmpl: dto.apellidoPaternoEmpl,
      rmuEmpl: MoneyUtil.toMoneyString(dto.rmuEmpl),
      tituloEmpl: dto.tituloEmpl,
      estadoEmpl: dto.estadoEmpl as EmpleadoEntity['estadoEmpl'],
      segundoNombreEmpl: dto.segundoNombreEmpl ?? null,
      apellidoMaternoEmpl: dto.apellidoMaternoEmpl ?? null,
      fechaTerminoEmpl: dto.fechaTerminoEmpl
        ? new Date(dto.fechaTerminoEmpl)
        : null,
      usuaIngre: 'admin',
    });

    return repository.save(empleado);
  }

  async actualizar(
    empleado: EmpleadoEntity,
    dto: UpdateEmpleadoDTO,
    manager?: EntityManager,
  ): Promise<EmpleadoEntity> {
    empleado.ideRol = dto.ideRol;
    empleado.cedulaEmpl = dto.cedulaEmpl;
    empleado.fechaNacimientoEmpl = new Date(dto.fechaNacimientoEmpl);
    empleado.edadEmpl = dto.edadEmpl;
    empleado.fechaInicioEmpl = new Date(dto.fechaInicioEmpl);
    empleado.primerNombreEmpl = dto.primerNombreEmpl;
    empleado.apellidoPaternoEmpl = dto.apellidoPaternoEmpl;
    empleado.rmuEmpl = MoneyUtil.toMoneyString(dto.rmuEmpl);
    empleado.tituloEmpl = dto.tituloEmpl;
    empleado.estadoEmpl = dto.estadoEmpl as EmpleadoEntity['estadoEmpl'];
    empleado.segundoNombreEmpl = dto.segundoNombreEmpl ?? null;
    empleado.apellidoMaternoEmpl = dto.apellidoMaternoEmpl ?? null;
    empleado.fechaTerminoEmpl = dto.fechaTerminoEmpl
      ? new Date(dto.fechaTerminoEmpl)
      : null;
    empleado.usuaActua = 'admin';
    empleado.fechaActua = new Date();

    return this.getEmpleadoRepository(manager).save(empleado);
  }

  async eliminar(ideEmpl: number, manager?: EntityManager): Promise<number> {
    const result = await this.getEmpleadoRepository(manager).delete({
      ideEmpl,
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

  private getEmpleadoRepository(
    manager?: EntityManager,
  ): Repository<EmpleadoEntity> {
    if (manager) {
      return manager.getRepository(EmpleadoEntity);
    }

    return this.empleadoRepository;
  }

  private getRolRepository(manager?: EntityManager): Repository<RolEntity> {
    if (manager) {
      return manager.getRepository(RolEntity);
    }

    return this.rolRepository;
  }
}
