import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ApiResponseFactory, ComboMapper } from '@common/index';
import { DataSource } from 'typeorm';
import { CreatePerfilDto } from './dto/create_perfil.dto';
import { FilterPerfilDto } from './dto/filter_perfil.dto';
import { UpdatePerfilDto } from './dto/update_perfil.dto';
import { PerfilesMapper } from './perfiles.mapper';
import { PerfilPermisoData, PerfilesRepository } from './perfiles.repository';
import { GuardarPermisosPerfilDto } from './dto/guardar_permisos_perfil.dto';

@Injectable()
export class PerfilesService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly perfilesRepository: PerfilesRepository,
  ) {}

  async listar() {
    const perfiles = await this.dataSource.transaction((manager) =>
      this.perfilesRepository.listar(manager),
    );

    return ApiResponseFactory.legacyRead(
      PerfilesMapper.toRows(perfiles),
      'Listado de perfiles obtenido',
    );
  }

  async buscar(id: number) {
    const idePerf = this.validarIdePerfil(id);

    const perfil = await this.dataSource.transaction((manager) =>
      this.perfilesRepository.buscarPorId(idePerf, manager),
    );

    return ApiResponseFactory.legacyRead(
      perfil ? [PerfilesMapper.toRow(perfil)] : [],
      'Perfil encontrado',
    );
  }

  async filtrar(queryParams: FilterPerfilDto) {
    const perfiles = await this.dataSource.transaction((manager) =>
      this.perfilesRepository.filtrar(queryParams, manager),
    );

    return ApiResponseFactory.legacyRead(
      PerfilesMapper.toRows(perfiles),
      'Filtrado de perfiles completado',
    );
  }

  async insertar(body: CreatePerfilDto, usuarioResponsable: string) {
    try {
      const perfil = await this.dataSource.transaction((manager) =>
        this.perfilesRepository.crear(body, usuarioResponsable, manager),
      );

      return ApiResponseFactory.legacyWrite(
        1,
        'Perfil registrado correctamente',
        perfil.idePerf,
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo registrar el perfil.',
      );
    }
  }

  async actualizar(body: UpdatePerfilDto, usuarioResponsable: string) {
    const idePerf = this.validarIdePerfil(body.idePerf);

    if (idePerf === 0) {
      return ApiResponseFactory.legacyWrite(
        0,
        'El perfil administrador principal no puede modificarse.',
      );
    }
    try {
      const perfil = await this.dataSource.transaction(async (manager) => {
        const perfilActual = await this.perfilesRepository.buscarPorId(
          idePerf,
          manager,
        );

        if (!perfilActual) {
          throw new Error('No se encontró el perfil indicado.');
        }

        return this.perfilesRepository.actualizar(
          perfilActual,
          body,
          usuarioResponsable,
          manager,
        );
      });

      return ApiResponseFactory.legacyWrite(
        1,
        'Perfil actualizado correctamente',
        perfil.idePerf,
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo actualizar el perfil.',
      );
    }
  }

  async eliminar(id: number) {
    const idePerf = this.validarIdePerfil(id);

    if (idePerf === 0) {
      return ApiResponseFactory.legacyWrite(
        0,
        'El perfil administrador principal no puede eliminarse.',
      );
    }

    try {
      const affected = await this.dataSource.transaction((manager) =>
        this.perfilesRepository.eliminar(idePerf, manager),
      );

      if (affected === 0) {
        return ApiResponseFactory.legacyWrite(
          0,
          'No se encontró el perfil indicado.',
        );
      }

      return ApiResponseFactory.legacyWrite(
        1,
        'Perfil eliminado correctamente',
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message ||
          'No se pudo eliminar el perfil. Puede estar relacionado con cuentas o accesos.',
      );
    }
  }

  async guardarPermisos(
    id: number,
    body: GuardarPermisosPerfilDto,
    usuarioResponsable: string,
  ) {
    const idePerf = this.validarIdePerfil(id);

    try {
      const total = await this.dataSource.transaction(async (manager) => {
        const perfil = await this.perfilesRepository.buscarPorIdConBloqueo(
          idePerf,
          manager,
        );

        if (!perfil) {
          throw new BadRequestException('No se encontró el perfil indicado.');
        }

        const opciones =
          await this.perfilesRepository.listarTodasOpciones(manager);

        const opcionesPorId = new Map(
          opciones.map((opcion) => [opcion.ideOpci, opcion]),
        );

        const permisosFinales = new Map<number, PerfilPermisoData>();

        /*
         * El administrador principal siempre
         * conserva acceso completo.
         */
        if (idePerf === 0 || perfil.nombrePerf === 'padmin') {
          for (const opcion of opciones) {
            permisosFinales.set(opcion.ideOpci, {
              ideOpci: opcion.ideOpci,
              listar: 'si',
              insertar: 'si',
              modificar: 'si',
              eliminar: 'si',
            });
          }
        } else {
          for (const permiso of body.permisos) {
            const opcion = opcionesPorId.get(permiso.ideOpci);

            if (!opcion) {
              throw new BadRequestException(
                `La opción ${permiso.ideOpci} no existe.`,
              );
            }

            permisosFinales.set(permiso.ideOpci, {
              ideOpci: permiso.ideOpci,
              listar: permiso.listar,
              insertar: permiso.insertar,
              modificar: permiso.modificar,
              eliminar: permiso.eliminar,
            });

            /*
             * Si una pantalla depende de una
             * opción padre, el padre también
             * debe formar parte del menú.
             */
            let idePadre = opcion.padreOpci ?? null;

            const visitados = new Set<number>();

            while (idePadre !== null) {
              if (visitados.has(idePadre)) {
                throw new BadRequestException(
                  'Se detectó un ciclo en la jerarquía de opciones.',
                );
              }

              visitados.add(idePadre);

              const opcionPadre = opcionesPorId.get(idePadre);

              if (!opcionPadre) {
                throw new BadRequestException(
                  `La opción padre ${idePadre} no existe.`,
                );
              }

              const permisoPadre = permisosFinales.get(idePadre);

              if (permisoPadre) {
                permisoPadre.listar = 'si';

                permisosFinales.set(idePadre, permisoPadre);
              } else {
                permisosFinales.set(idePadre, {
                  ideOpci: idePadre,
                  listar: 'si',
                  insertar: 'no',
                  modificar: 'no',
                  eliminar: 'no',
                });
              }

              idePadre = opcionPadre.padreOpci ?? null;
            }
          }
        }

        await this.perfilesRepository.eliminarPermisosPorPerfil(
          idePerf,
          manager,
        );

        const guardados = await this.perfilesRepository.guardarPermisos(
          idePerf,
          Array.from(permisosFinales.values()),
          usuarioResponsable,
          manager,
        );

        return guardados.length;
      });

      return ApiResponseFactory.legacyWrite(
        1,
        'Permisos del perfil actualizados correctamente',
        total,
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudieron actualizar los permisos del perfil.',
      );
    }
  }

  async listarPermisos(id: number) {
    const idePerf = this.validarIdePerfil(id);

    const resultado = await this.dataSource.transaction(async (manager) => {
      const perfil = await this.perfilesRepository.buscarPorId(
        idePerf,
        manager,
      );

      if (!perfil) {
        throw new BadRequestException('No se encontró el perfil indicado.');
      }

      const permisos = await this.perfilesRepository.listarOpcionesConPermisos(
        idePerf,
        manager,
      );

      return {
        perfil: {
          ide_perf: perfil.idePerf,
          nombre_perf: perfil.nombrePerf,
          descripcion_perf: perfil.descripcionPerf ?? null,
        },
        permisos,
      };
    });

    return {
      success: true,
      data: resultado,
      response: 'Permisos del perfil obtenidos correctamente',
    };
  }

  private validarIdePerfil(valor: number): number {
    const idePerf = Number(valor);

    /*
     * El perfil administrador existente
     * utiliza legítimamente el ID 0.
     */
    if (!Number.isInteger(idePerf) || idePerf < 0) {
      throw new BadRequestException('El ID del perfil no es válido.');
    }

    return idePerf;
  }

  /**
   * JOINS
   */
  async listarPerfiles() {
    return this.listar();
  }

  async filtrarPerfiles(queryParams: FilterPerfilDto) {
    return this.filtrar(queryParams);
  }

  /**
   * COMBOS
   */
  async listarComboPerfiles() {
    const perfiles = await this.dataSource.transaction((manager) =>
      this.perfilesRepository.listar(manager),
    );

    return ComboMapper.fromEntities(
      perfiles,
      (perfil) => perfil.nombrePerf,
      (perfil) => perfil.idePerf,
    );
  }

  async listarComboNombres() {
    return this.listarComboPerfiles();
  }

  async listarComboDescripcion() {
    const perfiles = await this.dataSource.transaction((manager) =>
      this.perfilesRepository.listar(manager),
    );

    const descripcionesUnicas = Array.from(
      new Set(
        perfiles
          .map((perfil) => perfil.descripcionPerf)
          .filter((descripcion) => !!descripcion),
      ),
    ).sort((a, b) => a.localeCompare(b));

    return ComboMapper.fromEntities(
      descripcionesUnicas,
      (descripcion) => descripcion,
      (descripcion) => descripcion,
    );
  }

  async listarComboRoles() {
    const roles = await this.dataSource.transaction((manager) =>
      this.perfilesRepository.listarRoles(manager),
    );

    return ComboMapper.fromEntities(
      roles,
      (rol) => rol.nombreRol,
      (rol) => rol.ideRol,
    );
  }
}
