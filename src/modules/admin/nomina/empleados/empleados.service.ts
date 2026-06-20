import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ApiResponseFactory, ComboMapper } from '@common/index';
import { DataSource } from 'typeorm';
import { CreateEmpleadoDTO } from './dto/create_empleado.dto';
import { FilterEmpleadoDTO } from './dto/filter_empleado.dto';
import { UpdateEmpleadoDTO } from './dto/update_empleado.dto';
import { EmpleadosMapper } from './empleados.mapper';
import { EmpleadosRepository } from './empleados.repository';

@Injectable()
export class EmpleadosService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly empleadosRepository: EmpleadosRepository,
  ) {}

  async listar() {
    const empleados = await this.dataSource.transaction((manager) =>
      this.empleadosRepository.listar(manager),
    );

    return ApiResponseFactory.legacyRead(
      EmpleadosMapper.toRows(empleados),
      'Listado de empleados obtenido',
    );
  }

  async buscar(id: number) {
    const ideEmpl = Number(id);

    if (!ideEmpl || Number.isNaN(ideEmpl)) {
      throw new BadRequestException('El ID del empleado no es válido.');
    }

    const empleado = await this.dataSource.transaction((manager) =>
      this.empleadosRepository.buscarPorId(ideEmpl, manager),
    );

    return ApiResponseFactory.legacyRead(
      empleado ? [EmpleadosMapper.toRow(empleado)] : [],
      'Empleado encontrado',
    );
  }

  async filtrar(queryParams: FilterEmpleadoDTO) {
    const empleados = await this.dataSource.transaction((manager) =>
      this.empleadosRepository.filtrar(queryParams, manager),
    );

    return ApiResponseFactory.legacyRead(
      EmpleadosMapper.toRows(empleados),
      'Filtrado de empleados completado',
    );
  }

  async insertar(body: CreateEmpleadoDTO) {
    try {
      const empleado = await this.dataSource.transaction((manager) =>
        this.empleadosRepository.crear(body, manager),
      );

      return ApiResponseFactory.legacyWrite(
        1,
        'Empleado registrado correctamente',
        empleado.ideEmpl,
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo registrar el empleado.',
      );
    }
  }

  async actualizar(body: UpdateEmpleadoDTO) {
    const ideEmpl = Number(body.ideEmpl);

    if (!ideEmpl || Number.isNaN(ideEmpl)) {
      throw new BadRequestException('El ID del empleado no es válido.');
    }

    try {
      const empleado = await this.dataSource.transaction(async (manager) => {
        const empleadoActual = await this.empleadosRepository.buscarPorId(
          ideEmpl,
          manager,
        );

        if (!empleadoActual) {
          throw new Error('No se encontró el empleado indicado.');
        }

        return this.empleadosRepository.actualizar(
          empleadoActual,
          body,
          manager,
        );
      });

      return ApiResponseFactory.legacyWrite(
        1,
        'Empleado actualizado correctamente',
        empleado.ideEmpl,
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo actualizar el empleado.',
      );
    }
  }

  async eliminar(id: number) {
    const ideEmpl = Number(id);

    if (!ideEmpl || Number.isNaN(ideEmpl)) {
      throw new BadRequestException('El ID del empleado no es válido.');
    }

    try {
      const affected = await this.dataSource.transaction((manager) =>
        this.empleadosRepository.eliminar(ideEmpl, manager),
      );

      if (affected === 0) {
        return ApiResponseFactory.legacyWrite(
          0,
          'No se encontró el empleado indicado.',
        );
      }

      return ApiResponseFactory.legacyWrite(
        1,
        'Empleado eliminado correctamente',
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message ||
          'No se pudo eliminar el empleado. Puede estar relacionado con ventas o cuentas.',
      );
    }
  }

  /**
   * JOINS
   */
  async listarEmpleados() {
    const empleados = await this.dataSource.transaction((manager) =>
      this.empleadosRepository.listar(manager),
    );

    return ApiResponseFactory.legacyRead(
      EmpleadosMapper.toRolRows(empleados),
      'Listado de empleados obtenido',
    );
  }

  async filtrarEmpleados(queryParams: FilterEmpleadoDTO) {
    const empleados = await this.dataSource.transaction((manager) =>
      this.empleadosRepository.filtrar(queryParams, manager),
    );

    return ApiResponseFactory.legacyRead(
      EmpleadosMapper.toRolRows(empleados),
      'Filtrado de empleados completado',
    );
  }

  /**
   * COMBOS
   */
  async listarComboEmpleados() {
    const empleados = await this.dataSource.transaction((manager) =>
      this.empleadosRepository.listar(manager),
    );

    return ComboMapper.fromEntities(
      empleados,
      (empleado) => EmpleadosMapper.getNombreCompleto(empleado),
      (empleado) => empleado.ideEmpl,
    );
  }

  async listarComboCedulas() {
    const empleados = await this.dataSource.transaction((manager) =>
      this.empleadosRepository.listar(manager),
    );

    const cedulasUnicas = Array.from(
      new Set(
        empleados
          .map((empleado) => empleado.cedulaEmpl)
          .filter((cedula) => !!cedula),
      ),
    ).sort((a, b) => a.localeCompare(b));

    return ComboMapper.fromEntities(
      cedulasUnicas,
      (cedula) => cedula,
      (cedula) => cedula,
    );
  }

  async listarComboPrimerNombre() {
    const empleados = await this.dataSource.transaction((manager) =>
      this.empleadosRepository.listar(manager),
    );

    const nombresUnicos = Array.from(
      new Set(
        empleados
          .map((empleado) => empleado.primerNombreEmpl)
          .filter((nombre) => !!nombre),
      ),
    ).sort((a, b) => a.localeCompare(b));

    return ComboMapper.fromEntities(
      nombresUnicos,
      (nombre) => nombre,
      (nombre) => nombre,
    );
  }

  async listarComboApellidoPaterno() {
    const empleados = await this.dataSource.transaction((manager) =>
      this.empleadosRepository.listar(manager),
    );

    const apellidosUnicos = Array.from(
      new Set(
        empleados
          .map((empleado) => empleado.apellidoPaternoEmpl)
          .filter((apellido) => !!apellido),
      ),
    ).sort((a, b) => a.localeCompare(b));

    return ComboMapper.fromEntities(
      apellidosUnicos,
      (apellido) => apellido,
      (apellido) => apellido,
    );
  }

  async listarComboTitulos() {
    const empleados = await this.dataSource.transaction((manager) =>
      this.empleadosRepository.listar(manager),
    );

    const titulosUnicos = Array.from(
      new Set(
        empleados
          .map((empleado) => empleado.tituloEmpl)
          .filter((titulo) => !!titulo),
      ),
    ).sort((a, b) => a.localeCompare(b));

    return ComboMapper.fromEntities(
      titulosUnicos,
      (titulo) => titulo,
      (titulo) => titulo,
    );
  }

  async listarComboEstados() {
    return ComboMapper.fromValues(['activo', 'inactivo']);
  }

  async listarComboRoles() {
    const roles = await this.dataSource.transaction((manager) =>
      this.empleadosRepository.listarRoles(manager),
    );

    return ComboMapper.fromEntities(
      roles,
      (rol) => rol.nombreRol,
      (rol) => rol.ideRol,
    );
  }
}
