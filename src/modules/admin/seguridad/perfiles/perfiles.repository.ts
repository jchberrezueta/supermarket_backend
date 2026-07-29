import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  OpcionesEntity,
  PerfilEntity,
  PerfilOpcionesEntity,
  RolEntity,
} from '@entities';
import { EntityManager, Repository } from 'typeorm';
import { CreatePerfilDto } from './dto/create_perfil.dto';
import { FilterPerfilDto } from './dto/filter_perfil.dto';
import { UpdatePerfilDto } from './dto/update_perfil.dto';

export interface PerfilPermisoData {
  ideOpci: number;
  listar: 'si' | 'no';
  insertar: 'si' | 'no';
  modificar: 'si' | 'no';
  eliminar: 'si' | 'no';
}

export interface OpcionPermisoPerfilRow {
  ide_perf_opci: number | null;
  ide_opci: number;
  nombre_opci: string;
  ruta_opci: string;
  descripcion_opci: string | null;
  activo_opci: 'si' | 'no';
  visible_opci: boolean;
  nivel_opci: number;
  padre_opci: number | null;
  icono_opci: string | null;
  asignado: boolean;
  listar: 'si' | 'no';
  insertar: 'si' | 'no';
  modificar: 'si' | 'no';
  eliminar: 'si' | 'no';
}

@Injectable()
export class PerfilesRepository {
  constructor(
    @InjectRepository(PerfilEntity)
    private readonly perfilRepository: Repository<PerfilEntity>,

    @InjectRepository(RolEntity)
    private readonly rolRepository: Repository<RolEntity>,

    @InjectRepository(OpcionesEntity)
    private readonly opcionesRepository: Repository<OpcionesEntity>,

    @InjectRepository(PerfilOpcionesEntity)
    private readonly perfilOpcionesRepository: Repository<PerfilOpcionesEntity>,
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

  async buscarPorIdConBloqueo(
    idePerf: number,
    manager: EntityManager,
  ): Promise<PerfilEntity | null> {
    return manager
      .getRepository(PerfilEntity)
      .createQueryBuilder('perfil')
      .setLock('pessimistic_write')
      .where('perfil.idePerf = :idePerf', {
        idePerf,
      })
      .getOne();
  }

  async filtrar(
    filtros: FilterPerfilDto,
    manager?: EntityManager,
  ): Promise<PerfilEntity[]> {
    const qb = this.getPerfilRepository(manager)
      .createQueryBuilder('perfil')
      .leftJoinAndSelect('perfil.rol', 'rol')
      .orderBy('perfil.nombrePerf', 'ASC');

    if (filtros.ideRol !== undefined && filtros.ideRol !== null) {
      qb.andWhere('perfil.ideRol = :ideRol', {
        ideRol: filtros.ideRol,
      });
    }

    if (filtros.nombreRol) {
      qb.andWhere('LOWER(rol.nombreRol) LIKE LOWER(:nombreRol)', {
        nombreRol: `%${filtros.nombreRol}%`,
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
    usuarioResponsable: string,
    manager?: EntityManager,
  ): Promise<PerfilEntity> {
    const repository = this.getPerfilRepository(manager);

    const perfil = repository.create({
      ideRol: dto.ideRol,
      nombrePerf: dto.nombrePerf.trim().toLowerCase(),
      descripcionPerf: dto.descripcionPerf?.trim() || null,
      usuaIngre: usuarioResponsable,
      usuaActua: null,
      fechaActua: null,
    });

    return repository.save(perfil);
  }

  async actualizar(
    perfil: PerfilEntity,
    dto: UpdatePerfilDto,
    usuarioResponsable: string,
    manager?: EntityManager,
  ): Promise<PerfilEntity> {
    perfil.ideRol = dto.ideRol;
    perfil.nombrePerf = dto.nombrePerf.trim().toLowerCase();
    perfil.descripcionPerf = dto.descripcionPerf?.trim() || null;
    perfil.usuaActua = usuarioResponsable;
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

  async listarTodasOpciones(
    manager?: EntityManager,
  ): Promise<OpcionesEntity[]> {
    return this.getOpcionesRepository(manager).find({
      order: {
        nivelOpci: 'ASC',
        ideOpci: 'ASC',
      },
    });
  }

  async listarOpcionesConPermisos(
    idePerf: number,
    manager?: EntityManager,
  ): Promise<OpcionPermisoPerfilRow[]> {
    return (
      this.getOpcionesRepository(manager)
        .createQueryBuilder('opcion')

        /*
         * TypeORM construye automáticamente
         * la relación por ide_opci.
         *
         * La condición adicional limita
         * los permisos al perfil consultado.
         */
        .leftJoin(
          'opcion.perfilesOpciones',
          'permiso',
          '"permiso"."ide_perf" = :idePerf',
          {
            idePerf,
          },
        )

        .select([
          `
        "permiso"."ide_perf_opci"
        AS "ide_perf_opci"
      `,

          `
        "opcion"."ide_opci"
        AS "ide_opci"
      `,

          `
        "opcion"."nombre_opci"
        AS "nombre_opci"
      `,

          `
        "opcion"."ruta_opci"
        AS "ruta_opci"
      `,

          `
        "opcion"."descripcion_opci"
        AS "descripcion_opci"
      `,

          `
        "opcion"."activo_opci"
        AS "activo_opci"
      `,

          `
        "opcion"."visible_opci"
        AS "visible_opci"
      `,

          `
        "opcion"."nivel_opci"
        AS "nivel_opci"
      `,

          `
        "opcion"."padre_opci"
        AS "padre_opci"
      `,

          `
        "opcion"."icono_opci"
        AS "icono_opci"
      `,

          `
        CASE
          WHEN
            "permiso"."ide_perf_opci"
            IS NULL
          THEN false
          ELSE true
        END
        AS "asignado"
      `,

          `
        COALESCE(
          "permiso"."listar",
          'no'
        )
        AS "listar"
      `,

          `
        COALESCE(
          "permiso"."insertar",
          'no'
        )
        AS "insertar"
      `,

          `
        COALESCE(
          "permiso"."modificar",
          'no'
        )
        AS "modificar"
      `,

          `
        COALESCE(
          "permiso"."eliminar",
          'no'
        )
        AS "eliminar"
      `,
        ])

        .orderBy('"opcion"."nivel_opci"', 'ASC')

        .addOrderBy('"opcion"."ide_opci"', 'ASC')

        .getRawMany<OpcionPermisoPerfilRow>()
    );
  }

  async eliminarPermisosPorPerfil(
    idePerf: number,
    manager: EntityManager,
  ): Promise<void> {
    await manager.getRepository(PerfilOpcionesEntity).delete({
      idePerf,
    });
  }

  async guardarPermisos(
    idePerf: number,
    permisos: PerfilPermisoData[],
    usuarioResponsable: string,
    manager: EntityManager,
  ): Promise<PerfilOpcionesEntity[]> {
    if (permisos.length === 0) {
      return [];
    }

    const repository = manager.getRepository(PerfilOpcionesEntity);

    const registros = permisos.map((permiso) =>
      repository.create({
        idePerf,
        ideOpci: permiso.ideOpci,
        listar: permiso.listar,
        insertar: permiso.insertar,
        modificar: permiso.modificar,
        eliminar: permiso.eliminar,
        usuaIngre: usuarioResponsable,
        usuaActua: null,
        fechaActua: null,
      }),
    );

    return repository.save(registros);
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

  private getOpcionesRepository(
    manager?: EntityManager,
  ): Repository<OpcionesEntity> {
    if (manager) {
      return manager.getRepository(OpcionesEntity);
    }

    return this.opcionesRepository;
  }
}
