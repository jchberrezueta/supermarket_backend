import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ApiResponseFactory, ComboMapper, IdUtil } from '@common/index';
import { DataSource } from 'typeorm';
import { FilterAccesoUsuarioDto } from './dto/filter_acceso.dto';
import { AccesosMapper } from './accesos.mapper';
import { AccesosRepository, RegistrarAccesoData } from './accesos.repository';

@Injectable()
export class AccesosUsuariosService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,

    private readonly accesosRepository: AccesosRepository,
  ) {}

  async listar() {
    const accesos = await this.dataSource.transaction((manager) =>
      this.accesosRepository.listar(manager),
    );

    return ApiResponseFactory.legacyRead(
      AccesosMapper.toRows(accesos),
      'Listado de accesos de usuario obtenido',
    );
  }

  async buscar(id: number) {
    const ideAcce = IdUtil.requireId(id, 'El ID del acceso no es válido.');

    const acceso = await this.dataSource.transaction((manager) =>
      this.accesosRepository.buscarPorId(ideAcce, manager),
    );

    return ApiResponseFactory.legacyRead(
      acceso ? [AccesosMapper.toRow(acceso)] : [],
      'Acceso de usuario encontrado',
    );
  }

  async filtrar(queryParams: FilterAccesoUsuarioDto) {
    const accesos = await this.dataSource.transaction((manager) =>
      this.accesosRepository.filtrar(queryParams, manager),
    );

    return ApiResponseFactory.legacyRead(
      AccesosMapper.toRows(accesos),
      'Filtrado de accesos de usuario completado',
    );
  }

  /**
   * Uso interno del sistema de autenticación.
   *
   * No debe exponerse mediante un endpoint público
   * porque el historial de seguridad no puede ser
   * creado manualmente por un usuario.
   */
  async registrarEventoAutenticacion(data: RegistrarAccesoData): Promise<void> {
    try {
      await this.dataSource.transaction((manager) =>
        this.accesosRepository.crear(data, manager),
      );
    } catch (error) {
      /*
       * Un problema al registrar auditoría no debe
       * provocar que el endpoint revele información
       * adicional sobre la autenticación.
       */
      console.error(
        'No fue posible registrar el evento de autenticación',
        error,
      );
    }
  }

  async registrarAccesoExitoso(data: {
    ideCuen: number;
    usuario: string;
    navegador?: string | null;
    ip?: string | null;
    latitud?: number | null;
    longitud?: number | null;
  }): Promise<void> {
    await this.registrarEventoAutenticacion({
      ideCuen: data.ideCuen,
      usuarioIntentado: data.usuario,
      resultadoAcce: 'exitoso',
      motivoAcce: null,
      navegadorAcce: data.navegador || 'desconocido',
      numIntFallAcce: 0,
      ipAcce: data.ip ?? null,
      latitudAcce: data.latitud ?? null,
      longitudAcce: data.longitud ?? null,
    });
  }

  async registrarAccesoFallido(data: {
    ideCuen?: number | null;
    usuario?: string | null;
    motivo: string;
    intentos: number;
    navegador?: string | null;
    ip?: string | null;
  }): Promise<void> {
    await this.registrarEventoAutenticacion({
      ideCuen: data.ideCuen ?? null,
      usuarioIntentado: data.usuario ?? null,
      resultadoAcce: 'fallido',
      motivoAcce: data.motivo,
      navegadorAcce: data.navegador || 'desconocido',
      numIntFallAcce: Math.max(0, data.intentos),
      ipAcce: data.ip ?? null,
      latitudAcce: null,
      longitudAcce: null,
    });
  }

  async listarAccesos() {
    return this.listar();
  }

  async filtrarAccesos(queryParams: FilterAccesoUsuarioDto) {
    return this.filtrar(queryParams);
  }

  async listarComboIps() {
    const accesos = await this.dataSource.transaction((manager) =>
      this.accesosRepository.listar(manager),
    );

    const ipsUnicas = Array.from(
      new Set(
        accesos
          .map((acceso) => acceso.ipAcce)
          .filter((ip): ip is string => Boolean(ip)),
      ),
    ).sort((a, b) => a.localeCompare(b));

    return ComboMapper.fromEntities(
      ipsUnicas,
      (ip) => ip,
      (ip) => ip,
    );
  }

  async listarComboNavegador() {
    const accesos = await this.dataSource.transaction((manager) =>
      this.accesosRepository.listar(manager),
    );

    const navegadoresUnicos = Array.from(
      new Set(accesos.map((acceso) => acceso.navegadorAcce).filter(Boolean)),
    ).sort((a, b) => a.localeCompare(b));

    return ComboMapper.fromEntities(
      navegadoresUnicos,
      (navegador) => navegador,
      (navegador) => navegador,
    );
  }

  async listarComboCuentas() {
    const cuentas = await this.dataSource.transaction((manager) =>
      this.accesosRepository.listarCuentas(manager),
    );

    return ComboMapper.fromEntities(
      cuentas,
      (cuenta) => cuenta.usuarioCuen,
      (cuenta) => cuenta.ideCuen,
    );
  }
}
