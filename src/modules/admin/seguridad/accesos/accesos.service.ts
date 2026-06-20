import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ApiResponseFactory, ComboMapper } from '@common/index';
import { DataSource } from 'typeorm';
import { CreateAccesoUsuarioDto } from './dto/create_acceso.dto';
import { FilterAccesoUsuarioDto } from './dto/filter_acceso.dto';
import { AccesosMapper } from './accesos.mapper';
import { AccesosRepository } from './accesos.repository';

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
    const ideAcce = Number(id);

    if (!ideAcce || Number.isNaN(ideAcce)) {
      throw new BadRequestException('El ID del acceso no es válido.');
    }

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

  async insertarAccesoUsuario(data: CreateAccesoUsuarioDto) {
    try {
      const acceso = await this.dataSource.transaction((manager) =>
        this.accesosRepository.crear(data, manager),
      );

      return ApiResponseFactory.legacyWrite(
        1,
        'Acceso de usuario registrado correctamente',
        acceso.ideAcce,
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo registrar el acceso de usuario.',
      );
    }
  }

  /**
   * JOINS
   */
  async listarAccesos() {
    return this.listar();
  }

  async filtrarAccesos(queryParams: FilterAccesoUsuarioDto) {
    return this.filtrar(queryParams);
  }

  /**
   * COMBOS
   */
  async listarComboIps() {
    const accesos = await this.dataSource.transaction((manager) =>
      this.accesosRepository.listar(manager),
    );

    const ipsUnicas = Array.from(
      new Set(accesos.map((acceso) => acceso.ipAcce).filter((ip) => !!ip)),
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
      new Set(
        accesos
          .map((acceso) => acceso.navegadorAcce)
          .filter((navegador) => !!navegador),
      ),
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
