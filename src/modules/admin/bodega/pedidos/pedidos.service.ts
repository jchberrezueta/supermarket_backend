import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ApiResponseFactory, ComboMapper, MoneyUtil } from '@common/index';
import { DataSource } from 'typeorm';
import { CreatePedidoDTO } from './dto/create_pedido.dto';
import { CreatePedidoDetalleDTO } from './dto/create_pedido_detalle.dto';
import { FilterPedidoDTO } from './dto/filter_pedido.dto';
import { UpdatePedidoDTO } from './dto/update_pedido.dto';
import { PedidosMapper } from './pedidos.mapper';
import { PedidosRepository } from './pedidos.repository';

interface TotalesPedidoCalculados {
  cantidadTotalPedi: number;
  totalPedi: number;
}

@Injectable()
export class PedidosService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly pedidosRepository: PedidosRepository,
  ) {}

  async listar() {
    const pedidos = await this.dataSource.transaction((manager) =>
      this.pedidosRepository.listar(manager),
    );

    return ApiResponseFactory.legacyRead(
      PedidosMapper.toRows(pedidos),
      'Listado de pedidos obtenido',
    );
  }

  async buscar(id: number) {
    const idePedi = Number(id);

    if (!idePedi || Number.isNaN(idePedi)) {
      throw new BadRequestException('El ID del pedido no es válido.');
    }

    const pedido = await this.dataSource.transaction((manager) =>
      this.pedidosRepository.buscarPorId(idePedi, manager),
    );

    return ApiResponseFactory.legacyRead(
      pedido ? [PedidosMapper.toRow(pedido)] : [],
      'Pedido encontrado',
    );
  }

  async filtrar(queryParams: FilterPedidoDTO) {
    const pedidos = await this.dataSource.transaction((manager) =>
      this.pedidosRepository.filtrar(queryParams, manager),
    );

    return ApiResponseFactory.legacyRead(
      PedidosMapper.toRows(pedidos),
      'Filtrado de pedidos completado',
    );
  }

  async insertar(body: CreatePedidoDTO) {
    this.validarDetallePedido(body.detallePedido);

    try {
      const pedido = await this.dataSource.transaction(async (manager) => {
        const totales = this.calcularTotalesDesdeDetalle(body.detallePedido);

        const pedidoCreado = await this.pedidosRepository.crearPedido(
          body.cabeceraPedido,
          totales,
          manager,
        );

        await this.pedidosRepository.reemplazarDetalles(
          pedidoCreado.idePedi,
          body.detallePedido,
          manager,
        );

        return pedidoCreado;
      });

      return ApiResponseFactory.legacyWrite(
        1,
        'Pedido registrado correctamente',
        pedido.idePedi,
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo registrar el pedido.',
      );
    }
  }

  async actualizar(body: UpdatePedidoDTO) {
    this.validarDetallePedido(body.detallePedido);

    const idePedi = Number(body.cabeceraPedido.idePedi);

    if (!idePedi || Number.isNaN(idePedi)) {
      throw new BadRequestException('El ID del pedido no es válido.');
    }

    try {
      const pedido = await this.dataSource.transaction(async (manager) => {
        const pedidoActual = await this.pedidosRepository.buscarPorIdForUpdate(
          idePedi,
          manager,
        );

        if (!pedidoActual) {
          throw new NotFoundException('No se encontró el pedido indicado.');
        }

        const totales = this.calcularTotalesDesdeDetalle(body.detallePedido);

        const pedidoActualizado = await this.pedidosRepository.actualizarPedido(
          pedidoActual,
          body.cabeceraPedido,
          totales,
          manager,
        );

        await this.pedidosRepository.reemplazarDetalles(
          pedidoActualizado.idePedi,
          body.detallePedido,
          manager,
        );

        return pedidoActualizado;
      });

      return ApiResponseFactory.legacyWrite(
        1,
        'Pedido actualizado correctamente',
        pedido.idePedi,
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo actualizar el pedido.',
      );
    }
  }

  async eliminar(id: number) {
    const idePedi = Number(id);

    if (!idePedi || Number.isNaN(idePedi)) {
      throw new BadRequestException('El ID del pedido no es válido.');
    }

    try {
      const affected = await this.dataSource.transaction((manager) =>
        this.pedidosRepository.eliminarPedidoConDetalles(idePedi, manager),
      );

      if (affected === 0) {
        return ApiResponseFactory.legacyWrite(
          0,
          'No se encontró el pedido indicado.',
        );
      }

      return ApiResponseFactory.legacyWrite(
        1,
        'Pedido eliminado correctamente',
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo eliminar el pedido.',
      );
    }
  }

  /**
   * JOINS
   */
  async listarPedidos() {
    return this.listar();
  }

  async filtrarPedidos(queryParams: FilterPedidoDTO) {
    return this.filtrar(queryParams);
  }

  async listarDetallesPedido(idPedido: number) {
    const idePedi = Number(idPedido);

    if (!idePedi || Number.isNaN(idePedi)) {
      throw new BadRequestException('El ID del pedido no es válido.');
    }

    const detalles = await this.dataSource.transaction((manager) =>
      this.pedidosRepository.listarDetallesPorPedido(idePedi, manager),
    );

    return ApiResponseFactory.legacyRead(
      PedidosMapper.toDetalleRows(detalles),
      'Filtrado de detalles de pedido completado',
    );
  }

  /**
   * COMBOS
   */
  async listarComboEstados() {
    return ComboMapper.fromValues(['progreso', 'completado', 'incompleto']);
  }

  async listarComboMotivos() {
    return ComboMapper.fromValues(['peticion', 'devolucion']);
  }

  async listarComboPedidos() {
    const pedidos = await this.dataSource.transaction((manager) =>
      this.pedidosRepository.listar(manager),
    );

    return ComboMapper.fromEntities(
      pedidos,
      (pedido) =>
        `Pedido #${pedido.idePedi} - ${pedido.empresa?.nombreEmpr ?? 'Empresa'}`,
      (pedido) => pedido.idePedi,
    );
  }

  private validarDetallePedido(detalles: CreatePedidoDetalleDTO[]): void {
    if (!Array.isArray(detalles) || detalles.length === 0) {
      throw new BadRequestException(
        'Debe agregar al menos un producto al pedido.',
      );
    }

    for (const detalle of detalles) {
      if (!detalle.ideProd || detalle.ideProd <= 0) {
        throw new BadRequestException(
          'Todos los detalles deben tener un producto válido.',
        );
      }

      if (!detalle.cantidadProd || detalle.cantidadProd <= 0) {
        throw new BadRequestException(
          'Todos los detalles deben tener una cantidad válida.',
        );
      }
    }
  }

  private calcularTotalesDesdeDetalle(
    detalles: CreatePedidoDetalleDTO[],
  ): TotalesPedidoCalculados {
    return detalles.reduce<TotalesPedidoCalculados>(
      (totales, detalle) => ({
        cantidadTotalPedi: totales.cantidadTotalPedi + detalle.cantidadProd,
        totalPedi: MoneyUtil.add(totales.totalPedi, detalle.totalProd),
      }),
      {
        cantidadTotalPedi: 0,
        totalPedi: 0,
      },
    );
  }
}
