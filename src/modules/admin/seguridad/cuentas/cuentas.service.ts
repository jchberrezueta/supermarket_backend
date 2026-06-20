import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ApiResponseFactory, ComboMapper } from '@common/index';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateCuentaDto } from './dto/create_cuenta.dto';
import { FiltroCuentaDto } from './dto/filter_cuenta.dto';
import { UpdateCuentaDto } from './dto/update_cuenta.dto';
import { CuentasMapper } from './cuentas.mapper';
import { CuentasRepository } from './cuentas.repository';

@Injectable()
export class CuentasService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly cuentasRepository: CuentasRepository,
  ) {}

  async listar() {
    const cuentas = await this.dataSource.transaction((manager) =>
      this.cuentasRepository.listar(manager),
    );

    return ApiResponseFactory.legacyRead(
      CuentasMapper.toRows(cuentas),
      'Listado de cuentas obtenido',
    );
  }

  async buscar(id: number) {
    const ideCuen = Number(id);

    if (!ideCuen || Number.isNaN(ideCuen)) {
      throw new BadRequestException('El ID de la cuenta no es válido.');
    }

    const cuenta = await this.dataSource.transaction((manager) =>
      this.cuentasRepository.buscarPorId(ideCuen, manager),
    );

    return ApiResponseFactory.legacyRead(
      cuenta ? [CuentasMapper.toRow(cuenta)] : [],
      'Cuenta encontrada',
    );
  }

  async filtrar(queryParams: FiltroCuentaDto) {
    const cuentas = await this.dataSource.transaction((manager) =>
      this.cuentasRepository.filtrar(queryParams, manager),
    );

    return ApiResponseFactory.legacyRead(
      CuentasMapper.toRows(cuentas),
      'Filtrado de cuentas completado',
    );
  }

  async eliminar(id: number) {
    const ideCuen = Number(id);

    if (!ideCuen || Number.isNaN(ideCuen)) {
      throw new BadRequestException('El ID de la cuenta no es válido.');
    }

    try {
      const affected = await this.dataSource.transaction((manager) =>
        this.cuentasRepository.eliminar(ideCuen, manager),
      );

      if (affected === 0) {
        return ApiResponseFactory.legacyWrite(
          0,
          'No se encontró la cuenta indicada.',
        );
      }

      return ApiResponseFactory.legacyWrite(
        1,
        'Cuenta eliminada correctamente',
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message ||
          'No se pudo eliminar la cuenta. Puede estar relacionada con accesos.',
      );
    }
  }

  async insertar(body: CreateCuentaDto) {
    try {
      const hashedPassword = await this.encriptadorHash(body.passwordCuen);

      const cuenta = await this.dataSource.transaction((manager) =>
        this.cuentasRepository.crear(body, hashedPassword, manager),
      );

      return ApiResponseFactory.legacyWrite(
        1,
        'Cuenta registrada correctamente',
        cuenta.ideCuen,
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo registrar la cuenta.',
      );
    }
  }

  async actualizar(body: UpdateCuentaDto) {
    const ideCuen = Number(body.ideCuen);

    if (!ideCuen || Number.isNaN(ideCuen)) {
      throw new BadRequestException('El ID de la cuenta no es válido.');
    }

    try {
      const passwordHash =
        body.passwordCuen && body.passwordCuen.trim() !== ''
          ? await this.encriptadorHash(body.passwordCuen)
          : null;

      const cuenta = await this.dataSource.transaction(async (manager) => {
        const cuentaActual = await this.cuentasRepository.buscarPorId(
          ideCuen,
          manager,
        );

        if (!cuentaActual) {
          throw new Error('No se encontró la cuenta indicada.');
        }

        return this.cuentasRepository.actualizar(
          cuentaActual,
          body,
          passwordHash,
          manager,
        );
      });

      return ApiResponseFactory.legacyWrite(
        1,
        'Cuenta actualizada correctamente',
        cuenta.ideCuen,
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo actualizar la cuenta.',
      );
    }
  }

  async encriptadorHash(value: string) {
    const saltRounds = 10;
    return bcrypt.hash(value, saltRounds);
  }

  /**
   * IMPORTANTE:
   * auth.service.ts espera snake_case:
   * - password_cuen
   * - usuario_cuen
   * - estado_cuen
   */
  async buscarUsuario(usuario: string) {
    const cuenta = await this.dataSource.transaction((manager) =>
      this.cuentasRepository.buscarPorUsuario(usuario, manager),
    );

    if (!cuenta) {
      return undefined;
    }

    return CuentasMapper.toAuthRaw(cuenta);
  }

  async getPerfilPermisos(idCuenta: string) {
    const ideCuen = Number(idCuenta);

    if (!ideCuen || Number.isNaN(ideCuen)) {
      return [];
    }

    return this.dataSource.transaction((manager) =>
      this.cuentasRepository.getPerfilPermisos(ideCuen, manager),
    );
  }

  /**
   * Adapter temporal:
   * aún conserva obtener_rutas_json para no romper el menú/sidebar.
   * Luego lo reemplazamos por construcción de árbol en TypeScript.
   */
  async getSidebarRutas(idCuenta: string) {
    const ideCuen = Number(idCuenta);

    if (!ideCuen || Number.isNaN(ideCuen)) {
      return [];
    }

    const query = `
      SELECT 
        jsonb_agg(obtener_rutas_json(d.ide_opci, b.ide_perf)) AS menu
      FROM cuenta a
      LEFT JOIN perfil b ON b.ide_perf = a.ide_perf
      LEFT JOIN perfil_opciones c ON c.ide_perf = b.ide_perf
      LEFT JOIN opciones d ON d.ide_opci = c.ide_opci
      WHERE a.ide_cuen = $1
        AND a.estado_cuen = 'activo'
        AND d.padre_opci IS NULL
        AND d.activo_opci = 'si'
    `;

    const result = await this.dataSource.query(query, [ideCuen]);

    return result?.[0]?.menu ?? [];
  }

  /**
   * JOINS
   */
  async listarCuentas() {
    return this.listar();
  }

  async filtrarCuentas(queryParams: FiltroCuentaDto) {
    return this.filtrar(queryParams);
  }

  /**
   * COMBOS
   */
  async listarComboCuentas() {
    const cuentas = await this.dataSource.transaction((manager) =>
      this.cuentasRepository.listar(manager),
    );

    return ComboMapper.fromEntities(
      cuentas,
      (cuenta) => cuenta.usuarioCuen,
      (cuenta) => cuenta.ideCuen,
    );
  }

  async listarComboUsuarios() {
    const cuentas = await this.dataSource.transaction((manager) =>
      this.cuentasRepository.listar(manager),
    );

    const usuariosUnicos = Array.from(
      new Set(
        cuentas
          .map((cuenta) => cuenta.usuarioCuen)
          .filter((usuario) => !!usuario),
      ),
    ).sort((a, b) => a.localeCompare(b));

    return ComboMapper.fromEntities(
      usuariosUnicos,
      (usuario) => usuario,
      (usuario) => usuario,
    );
  }

  async listarComboEstados() {
    return ComboMapper.fromValues(['activo', 'inactivo', 'bloqueado']);
  }

  async listarComboEmpleados() {
    const empleados = await this.dataSource.transaction((manager) =>
      this.cuentasRepository.listarEmpleados(manager),
    );

    return ComboMapper.fromEntities(
      empleados,
      (empleado) =>
        [
          empleado.primerNombreEmpl,
          empleado.segundoNombreEmpl,
          empleado.apellidoPaternoEmpl,
          empleado.apellidoMaternoEmpl,
        ]
          .filter((value) => !!value)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim(),
      (empleado) => empleado.ideEmpl,
    );
  }

  async listarComboPerfiles() {
    const perfiles = await this.dataSource.transaction((manager) =>
      this.cuentasRepository.listarPerfiles(manager),
    );

    return ComboMapper.fromEntities(
      perfiles,
      (perfil) => perfil.nombrePerf,
      (perfil) => perfil.idePerf,
    );
  }
}
