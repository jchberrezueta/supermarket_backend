import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ApiResponseFactory, ComboMapper, IdUtil } from '@common/index';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateCuentaDto } from './dto/create_cuenta.dto';
import { FiltroCuentaDto } from './dto/filter_cuenta.dto';
import { UpdateCuentaDto } from './dto/update_cuenta.dto';
import { CuentasMapper } from './cuentas.mapper';
import { CuentasRepository, SidebarOptionRaw } from './cuentas.repository';
import {
  CuentaEntity,
  HistorialClaveEntity,
  PasswordResetTokenEntity,
  RefreshTokenEntity,
} from '@entities';

export interface SidebarOption {
  id: number;
  titulo: string;
  ruta: string;
  icono: string | null;
  activo: 'si' | 'no';
  hijas: SidebarOption[];
  visible: boolean;
}

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
    const ideCuen = IdUtil.requireId(id, 'El ID de la cuenta no es válido.');

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
    const ideCuen = IdUtil.requireId(id, 'El ID de la cuenta no es válido.');

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

  async insertar(body: CreateCuentaDto, usuarioResponsable: string) {
    try {
      this.validarClaveAdministrativa(body.passwordCuen);

      const usuarioNormalizado = body.usuarioCuen.trim().toLowerCase();

      const cuentaExistente = await this.dataSource.transaction((manager) =>
        this.cuentasRepository.buscarPorUsuario(usuarioNormalizado, manager),
      );

      if (cuentaExistente) {
        throw new BadRequestException(
          'El nombre de usuario ya está registrado',
        );
      }

      const hashedPassword = await this.encriptadorHash(body.passwordCuen);

      const cuenta = await this.dataSource.transaction((manager) =>
        this.cuentasRepository.crear(
          {
            ...body,
            usuarioCuen: usuarioNormalizado,
          },
          hashedPassword,
          usuarioResponsable,
          manager,
        ),
      );

      return ApiResponseFactory.legacyWrite(
        1,
        'Cuenta registrada correctamente. El usuario deberá cambiar la contraseña en su primer acceso.',
        cuenta.ideCuen,
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo registrar la cuenta.',
      );
    }
  }

  async actualizar(body: UpdateCuentaDto, usuarioResponsable: string) {
    const ideCuen = IdUtil.requireId(
      body.ideCuen,
      'El ID de la cuenta no es válido.',
    );

    try {
      const cuenta = await this.dataSource.transaction(async (manager) => {
        const cuentaActual = await this.cuentasRepository.buscarPorId(
          ideCuen,
          manager,
        );

        if (!cuentaActual) {
          throw new Error('No se encontró la cuenta indicada.');
        }

        const usuarioNormalizado = body.usuarioCuen.trim().toLowerCase();

        const cuentaMismoUsuario =
          await this.cuentasRepository.buscarPorUsuario(
            usuarioNormalizado,
            manager,
          );

        if (cuentaMismoUsuario && cuentaMismoUsuario.ideCuen !== ideCuen) {
          throw new BadRequestException(
            'El nombre de usuario ya pertenece a otra cuenta',
          );
        }

        return this.cuentasRepository.actualizar(
          cuentaActual,
          {
            ...body,
            usuarioCuen: usuarioNormalizado,
          },
          usuarioResponsable,
          manager,
        );
      });

      /*
       * Si la cuenta dejó de estar activa,
       * sus sesiones deben revocarse.
       */
      if (cuenta.estadoCuen !== 'activo') {
        await this.dataSource.transaction(async (manager) => {
          await manager
            .getRepository(RefreshTokenEntity)
            .createQueryBuilder()
            .update(RefreshTokenEntity)
            .set({
              revocado: true,
              usuaActua: usuarioResponsable,
              fechaActua: () => 'CURRENT_TIMESTAMP',
            })
            .where('ide_cuen = :ideCuen', {
              ideCuen,
            })
            .andWhere('revocado = false')
            .execute();
        });
      }

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

  async incrementarIntentos(idCuenta: number) {
    await this.dataSource.transaction((manager) =>
      this.cuentasRepository.incrementarIntentos(idCuenta, manager),
    );
  }

  async reiniciarIntentos(idCuenta: number) {
    await this.dataSource.transaction((manager) =>
      this.cuentasRepository.reiniciarIntentos(idCuenta, manager),
    );
  }

  async bloquearCuenta(idCuenta: number, fecha: Date) {
    await this.dataSource.transaction((manager) =>
      this.cuentasRepository.bloquearCuenta(idCuenta, fecha, manager),
    );
  }

  async desbloquearCuenta(idCuenta: number) {
    await this.dataSource.transaction((manager) =>
      this.cuentasRepository.desbloquearCuenta(idCuenta, manager),
    );
  }

  async actualizarUltimoLogin(idCuenta: number) {
    await this.dataSource.transaction((manager) =>
      this.cuentasRepository.actualizarUltimoLogin(idCuenta, manager),
    );
  }

  async cambiarClave(idCuenta: number, passwordHash: string) {
    await this.dataSource.transaction((manager) =>
      this.cuentasRepository.cambiarClave(idCuenta, passwordHash, manager),
    );
  }

  async restablecerClaveAdministrativamente(
    ideCuenEntrada: number,
    claveTemporal: string,
    usuarioResponsable: string,
  ) {
    const ideCuen = IdUtil.requireId(
      ideCuenEntrada,
      'El ID de la cuenta no es válido.',
    );

    this.validarClaveAdministrativa(claveTemporal);

    try {
      const nuevoHash = await this.encriptadorHash(claveTemporal);

      await this.dataSource.transaction(async (manager) => {
        const cuentaRepository = manager.getRepository(CuentaEntity);

        const cuenta = await cuentaRepository
          .createQueryBuilder('cuenta')
          .setLock('pessimistic_write')
          .where('cuenta.ide_cuen = :ideCuen', {
            ideCuen,
          })
          .getOne();

        if (!cuenta) {
          throw new Error('No se encontró la cuenta indicada.');
        }

        const coincideActual = await bcrypt.compare(
          claveTemporal,
          cuenta.passwordCuen,
        );

        if (coincideActual) {
          throw new BadRequestException(
            'La contraseña temporal debe ser diferente de la contraseña actual',
          );
        }

        /*
         * Conservamos la contraseña anterior
         * antes de reemplazarla.
         */
        const historialRepository = manager.getRepository(HistorialClaveEntity);

        const historial = historialRepository.create({
          ideCuen: cuenta.ideCuen,
          passwordHash: cuenta.passwordCuen,
          usuaIngre: usuarioResponsable,
        });

        await historialRepository.save(historial);

        cuenta.passwordCuen = nuevoHash;
        cuenta.debeCambiarClave = true;
        cuenta.intentosFallidosCuen = 0;
        cuenta.fechaBloqueoCuen = null;
        cuenta.usuaActua = usuarioResponsable;
        cuenta.fechaActua = new Date();

        await cuentaRepository.save(cuenta);

        /*
         * Los enlaces de recuperación
         * anteriores quedan invalidados.
         */
        await manager
          .getRepository(PasswordResetTokenEntity)
          .createQueryBuilder()
          .update(PasswordResetTokenEntity)
          .set({
            utilizado: true,
            usuaActua: usuarioResponsable,
            fechaActua: () => 'CURRENT_TIMESTAMP',
          })
          .where('ide_cuen = :ideCuen', {
            ideCuen,
          })
          .andWhere('utilizado = false')
          .execute();

        /*
         * Todas las sesiones activas
         * quedan revocadas.
         */
        await manager
          .getRepository(RefreshTokenEntity)
          .createQueryBuilder()
          .update(RefreshTokenEntity)
          .set({
            revocado: true,
            usuaActua: usuarioResponsable,
            fechaActua: () => 'CURRENT_TIMESTAMP',
          })
          .where('ide_cuen = :ideCuen', {
            ideCuen,
          })
          .andWhere('revocado = false')
          .execute();
      });

      return ApiResponseFactory.legacyWrite(
        1,
        'Contraseña restablecida. El usuario deberá cambiarla en su siguiente acceso.',
        ideCuen,
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo restablecer la contraseña.',
      );
    }
  }

  private validarClaveAdministrativa(clave: string): void {
    const errores: string[] = [];

    if (!clave || clave.length < 8) {
      errores.push('La contraseña debe tener al menos 8 caracteres');
    }

    if (clave.length > 100) {
      errores.push('La contraseña no puede superar 100 caracteres');
    }

    if (!/[A-Z]/.test(clave)) {
      errores.push('Debe contener una letra mayúscula');
    }

    if (!/[a-z]/.test(clave)) {
      errores.push('Debe contener una letra minúscula');
    }

    if (!/[0-9]/.test(clave)) {
      errores.push('Debe contener un número');
    }

    if (!/[^A-Za-z0-9]/.test(clave)) {
      errores.push('Debe contener un carácter especial');
    }

    if (errores.length > 0) {
      throw new BadRequestException(errores);
    }
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

  async buscarCuentaInterna(idCuenta: number) {
    return this.dataSource.transaction((manager) =>
      this.cuentasRepository.buscarPorId(idCuenta, manager),
    );
  }

  async getPerfilPermisos(idCuenta: string) {
    const ideCuen = IdUtil.parseId(idCuenta);

    if (ideCuen === null) {
      return [];
    }

    return this.dataSource.transaction((manager) =>
      this.cuentasRepository.getPerfilPermisos(ideCuen, manager),
    );
  }

  /**
   * Sidebar construido en TypeScript.
   *
   * Antes dependía de:
   * - jsonb_agg
   * - obtener_rutas_json
   *
   * Eso era PostgreSQL puro. Ahora el repository obtiene las opciones
   * permitidas con TypeORM y este service arma el árbol del menú.
   */
  async getSidebarRutas(idCuenta: string) {
    const ideCuen = IdUtil.parseId(idCuenta);

    if (ideCuen === null) {
      return [];
    }

    const opciones = await this.dataSource.transaction((manager) =>
      this.cuentasRepository.listarOpcionesSidebar(ideCuen, manager),
    );

    return this.construirArbolSidebar(opciones);
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

  private construirArbolSidebar(opciones: SidebarOptionRaw[]): SidebarOption[] {
    const mapa = new Map<number, SidebarOption>();
    const raices: SidebarOption[] = [];

    for (const opcion of opciones) {
      mapa.set(opcion.id, {
        id: opcion.id,
        titulo: opcion.titulo,
        ruta: opcion.ruta,
        icono: opcion.icono ?? null,
        activo: opcion.activo,
        hijas: [],
        visible: opcion.visible,
      });
    }

    for (const opcion of opciones) {
      const nodo = mapa.get(opcion.id);

      if (!nodo) {
        continue;
      }

      const esRaiz = opcion.padre === null || opcion.padre === undefined;

      if (esRaiz) {
        raices.push(nodo);
        continue;
      }

      const padre = mapa.get(opcion.padre);

      if (padre) {
        padre.hijas.push(nodo);
      } else {
        raices.push(nodo);
      }
    }

    return raices;
  }
}
