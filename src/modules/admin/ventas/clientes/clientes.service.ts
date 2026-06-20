import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ApiResponseFactory, ComboMapper } from '@common/index';
import { DataSource } from 'typeorm';
import { ClientesMapper } from './clientes.mapper';
import { ClientesRepository } from './clientes.repository';
import { CreateClienteDTO } from './dto/create_cliente.dto';
import { FilterClienteDTO } from './dto/filter_cliente.dto';
import { UpdateClienteDTO } from './dto/update_cliente.dto';

@Injectable()
export class ClientesService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly clientesRepository: ClientesRepository,
  ) {}

  async listar() {
    const clientes = await this.dataSource.transaction((manager) =>
      this.clientesRepository.listar(manager),
    );

    return ApiResponseFactory.legacyRead(
      ClientesMapper.toRows(clientes),
      'Listado de clientes obtenido',
    );
  }

  async buscar(id: number) {
    const ideClie = Number(id);

    if (!ideClie || Number.isNaN(ideClie)) {
      throw new BadRequestException('El ID del cliente no es válido.');
    }

    const cliente = await this.dataSource.transaction((manager) =>
      this.clientesRepository.buscarPorId(ideClie, manager),
    );

    return ApiResponseFactory.legacyRead(
      cliente ? [ClientesMapper.toRow(cliente)] : [],
      'Cliente encontrado',
    );
  }

  async filtrar(queryParams: FilterClienteDTO) {
    const clientes = await this.dataSource.transaction((manager) =>
      this.clientesRepository.filtrar(queryParams, manager),
    );

    return ApiResponseFactory.legacyRead(
      ClientesMapper.toRows(clientes),
      'Filtrado de clientes completado',
    );
  }

  async insertar(body: CreateClienteDTO) {
    try {
      const cliente = await this.dataSource.transaction((manager) =>
        this.clientesRepository.crear(body, manager),
      );

      return ApiResponseFactory.legacyWrite(
        1,
        'Cliente registrado correctamente',
        cliente.ideClie,
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo registrar el cliente.',
      );
    }
  }

  async actualizar(body: UpdateClienteDTO) {
    const ideClie = Number(body.ideClie);

    if (!ideClie || Number.isNaN(ideClie)) {
      throw new BadRequestException('El ID del cliente no es válido.');
    }

    try {
      const cliente = await this.dataSource.transaction(async (manager) => {
        const clienteActual = await this.clientesRepository.buscarPorId(
          ideClie,
          manager,
        );

        if (!clienteActual) {
          throw new Error('No se encontró el cliente indicado.');
        }

        return this.clientesRepository.actualizar(clienteActual, body, manager);
      });

      return ApiResponseFactory.legacyWrite(
        1,
        'Cliente actualizado correctamente',
        cliente.ideClie,
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo actualizar el cliente.',
      );
    }
  }

  async eliminar(id: number) {
    const ideClie = Number(id);

    if (!ideClie || Number.isNaN(ideClie)) {
      throw new BadRequestException('El ID del cliente no es válido.');
    }

    try {
      const affected = await this.dataSource.transaction((manager) =>
        this.clientesRepository.eliminar(ideClie, manager),
      );

      if (affected === 0) {
        return ApiResponseFactory.legacyWrite(
          0,
          'No se encontró el cliente indicado.',
        );
      }

      return ApiResponseFactory.legacyWrite(
        1,
        'Cliente eliminado correctamente',
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo eliminar el cliente.',
      );
    }
  }

  /**
   * JOINS
   */
  async listarClientes() {
    const clientes = await this.dataSource.transaction((manager) =>
      this.clientesRepository.listarConCuenta(manager),
    );

    return ApiResponseFactory.legacyRead(
      ClientesMapper.toCuentaRows(clientes),
      'Listado de clientes obtenido',
    );
  }

  /**
   * COMBOS
   */
  async listarComboClientes() {
    const clientes = await this.dataSource.transaction((manager) =>
      this.clientesRepository.listar(manager),
    );

    return ComboMapper.fromEntities(
      clientes,
      (cliente) => ClientesMapper.getNombreCompleto(cliente),
      (cliente) => cliente.ideClie,
    );
  }

  async listarComboCedulas() {
    const clientes = await this.dataSource.transaction((manager) =>
      this.clientesRepository.listar(manager),
    );

    return ComboMapper.fromEntities(
      clientes,
      (cliente) => cliente.cedulaClie,
      (cliente) => cliente.ideClie,
    );
  }

  async listarComboNombres() {
    const clientes = await this.dataSource.transaction((manager) =>
      this.clientesRepository.listar(manager),
    );

    return ComboMapper.fromEntities(
      clientes,
      (cliente) => cliente.primerNombreClie,
      (cliente) => cliente.ideClie,
    );
  }

  async listarComboApellidos() {
    const clientes = await this.dataSource.transaction((manager) =>
      this.clientesRepository.listar(manager),
    );

    return ComboMapper.fromEntities(
      clientes,
      (cliente) => cliente.apellidoPaternoClie,
      (cliente) => cliente.ideClie,
    );
  }

  async listarComboSocio() {
    return ComboMapper.fromValues(['si', 'no']);
  }

  async listarComboTerceraEdad() {
    return ComboMapper.fromValues(['si', 'no']);
  }
}
