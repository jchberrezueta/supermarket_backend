import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ApiResponseFactory, ComboMapper, IdUtil } from '@common/index';
import { DataSource } from 'typeorm';
import { CreateOpcionDto } from './dto/create_opcion.dto';
import { FilterOpcionDto } from './dto/filter_opcion.dto';
import { UpdateOpcionDto } from './dto/update_opcion.dto';
import { OpcionesMapper } from './opciones.mapper';
import { OpcionesRepository } from './opciones.repository';

@Injectable()
export class OpcionesService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly opcionesRepository: OpcionesRepository,
  ) {}

  async listar() {
    const opciones = await this.dataSource.transaction((manager) =>
      this.opcionesRepository.listar(manager),
    );

    return ApiResponseFactory.legacyRead(
      OpcionesMapper.toRows(opciones),
      'Listado de opciones obtenido',
    );
  }

  async buscar(id: number) {
    const ideOpci = IdUtil.requireId(id, 'El ID de la opción no es válido.');

    const opcion = await this.dataSource.transaction((manager) =>
      this.opcionesRepository.buscarPorId(ideOpci, manager),
    );

    return ApiResponseFactory.legacyRead(
      opcion ? [OpcionesMapper.toRow(opcion)] : [],
      'Opción encontrada',
    );
  }

  async filtrar(queryParams: FilterOpcionDto) {
    const opciones = await this.dataSource.transaction((manager) =>
      this.opcionesRepository.filtrar(queryParams, manager),
    );

    return ApiResponseFactory.legacyRead(
      OpcionesMapper.toRows(opciones),
      'Filtrado de opciones completado',
    );
  }

  async insertar(body: CreateOpcionDto, usuarioResponsable: string) {
    try {
      const opcion = await this.dataSource.transaction(async (manager) => {
        if (body.padreOpci !== null && body.padreOpci !== undefined) {
          const padre = await this.opcionesRepository.buscarPorId(
            body.padreOpci,
            manager,
          );

          if (!padre) {
            throw new Error('La opción padre seleccionada no existe.');
          }
        }

        return this.opcionesRepository.crear(body, usuarioResponsable, manager);
      });

      return ApiResponseFactory.legacyWrite(
        1,
        'Opción registrada correctamente',
        opcion.ideOpci,
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error instanceof Error
          ? error.message
          : 'No se pudo registrar la opción.',
      );
    }
  }

  async actualizar(body: UpdateOpcionDto, usuarioResponsable: string) {
    const ideOpci = IdUtil.requireId(
      body.ideOpci,
      'El ID de la opción no es válido.',
    );

    if (
      body.padreOpci !== null &&
      body.padreOpci !== undefined &&
      body.padreOpci === ideOpci
    ) {
      return ApiResponseFactory.legacyWrite(
        0,
        'Una opción no puede ser su propio padre.',
      );
    }

    try {
      const opcion = await this.dataSource.transaction(async (manager) => {
        const opcionActual = await this.opcionesRepository.buscarPorId(
          ideOpci,
          manager,
        );

        if (!opcionActual) {
          throw new Error('No se encontró la opción indicada.');
        }

        if (body.padreOpci !== null && body.padreOpci !== undefined) {
          const padre = await this.opcionesRepository.buscarPorId(
            body.padreOpci,
            manager,
          );

          if (!padre) {
            throw new Error('La opción padre seleccionada no existe.');
          }
        }

        return this.opcionesRepository.actualizar(
          opcionActual,
          body,
          usuarioResponsable,
          manager,
        );
      });

      return ApiResponseFactory.legacyWrite(
        1,
        'Opción actualizada correctamente',
        opcion.ideOpci,
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error instanceof Error
          ? error.message
          : 'No se pudo actualizar la opción.',
      );
    }
  }

  async eliminar(id: number) {
    const ideOpci = IdUtil.requireId(id, 'El ID de la opción no es válido.');

    try {
      const affected = await this.dataSource.transaction((manager) =>
        this.opcionesRepository.eliminar(ideOpci, manager),
      );

      if (affected === 0) {
        return ApiResponseFactory.legacyWrite(
          0,
          'No se encontró la opción indicada.',
        );
      }

      return ApiResponseFactory.legacyWrite(
        1,
        'Opción eliminada correctamente',
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message ||
          'No se pudo eliminar la opción. Puede estar relacionada con perfiles.',
      );
    }
  }

  /**
   * COMBOS
   */
  async listarComboNombres() {
    const opciones = await this.dataSource.transaction((manager) =>
      this.opcionesRepository.listar(manager),
    );

    return ComboMapper.fromEntities(
      opciones,
      (opcion) => opcion.nombreOpci,
      (opcion) => opcion.ideOpci,
    );
  }

  async listarComboRutas() {
    const opciones = await this.dataSource.transaction((manager) =>
      this.opcionesRepository.listar(manager),
    );

    return ComboMapper.fromEntities(
      opciones,
      (opcion) => opcion.rutaOpci,
      (opcion) => opcion.ideOpci,
    );
  }

  async listarComboNiveles() {
    const opciones = await this.dataSource.transaction((manager) =>
      this.opcionesRepository.listar(manager),
    );

    const niveles = Array.from(
      new Set(opciones.map((opcion) => opcion.nivelOpci)),
    ).sort((a, b) => a - b);

    return ComboMapper.fromEntities(
      niveles,
      (nivel) => `Nivel ${nivel}`,
      (nivel) => nivel,
    );
  }

  async listarComboPadres() {
    const opciones = await this.dataSource.transaction((manager) =>
      this.opcionesRepository.listar(manager),
    );

    return ComboMapper.fromEntities(
      opciones,
      (opcion) => `${opcion.nombreOpci} — ${opcion.rutaOpci}`,
      (opcion) => opcion.ideOpci,
    );
  }

  async listarComboEstados() {
    return [
      {
        label: 'Activo',
        value: 'si',
      },
      {
        label: 'Inactivo',
        value: 'no',
      },
    ];
  }
}
