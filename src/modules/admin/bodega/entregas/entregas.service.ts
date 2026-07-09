import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import {
  ApiResponseFactory,
  ComboMapper,
  IdUtil,
  MoneyUtil,
} from '@common/index';
import { DetalleEntregaEntity, PedidoEntity, ProductoEntity } from '@entities';
import { DataSource, EntityManager } from 'typeorm';
import { CreateEntregaDTO } from './dto/create_entrega.dto';
import { CreateEntregaDetalleDTO } from './dto/create_entrega_detalle.dto';
import { FilterEntregaDTO } from './dto/filter_entrega.dto';
import { UpdateEntregaDTO } from './dto/update_entrega.dto';
import { UpdateEntregaDetalleDTO } from './dto/update_entrega_detalle.dto';
import { EntregasMapper } from './entregas.mapper';
import { EntregasRepository } from './entregas.repository';

type MovimientoEntrega = -1 | 0 | 1;

interface TotalesEntregaCalculados {
  cantidadTotalEntr: number;
  totalEntr: number;
}

@Injectable()
export class EntregasService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly entregasRepository: EntregasRepository,
  ) {}

  async listar() {
    const entregas = await this.dataSource.transaction((manager) =>
      this.entregasRepository.listar(manager),
    );

    return ApiResponseFactory.legacyRead(
      EntregasMapper.toRows(entregas),
      'Listado de entregas obtenido',
    );
  }

  async buscar(id: number) {
    const ideEntr = IdUtil.requireId(id, 'El ID de la entrega no es válido.');

    const entrega = await this.dataSource.transaction((manager) =>
      this.entregasRepository.buscarPorId(ideEntr, manager),
    );

    return ApiResponseFactory.legacyRead(
      entrega ? [EntregasMapper.toRow(entrega)] : [],
      'Entrega encontrada',
    );
  }

  async filtrar(queryParams: FilterEntregaDTO) {
    const entregas = await this.dataSource.transaction((manager) =>
      this.entregasRepository.filtrar(queryParams, manager),
    );

    return ApiResponseFactory.legacyRead(
      EntregasMapper.toRows(entregas),
      'Filtrado de entregas completado',
    );
  }

  async insertar(body: CreateEntregaDTO) {
    const detalles = body.detalleEntrega ?? [];
    this.validarDetalleEntrega(detalles, true);

    try {
      const entrega = await this.dataSource.transaction(async (manager) => {
        const pedido = await this.validarPedidoYProveedor(
          body.cabeceraEntrega.idePedi,
          body.cabeceraEntrega.ideProv,
          manager,
        );

        const movimientoNuevo = this.obtenerMovimientoEntrega(
          pedido,
          body.cabeceraEntrega.estadoEntr,
        );

        await this.ajustarStockPorCambioDeEntrega(
          new Map<number, number>(),
          0,
          this.consolidarCantidadesPorProducto(detalles),
          movimientoNuevo,
          manager,
        );

        const totales = this.calcularTotalesDesdeDetalle(
          detalles,
          body.cabeceraEntrega,
        );

        const entregaCreada = await this.entregasRepository.crearEntrega(
          body.cabeceraEntrega,
          totales,
          manager,
        );

        await this.entregasRepository.reemplazarDetalles(
          entregaCreada.ideEntr,
          detalles,
          manager,
        );

        return entregaCreada;
      });

      return ApiResponseFactory.legacyWrite(
        1,
        'Entrega registrada correctamente',
        entrega.ideEntr,
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo registrar la entrega.',
      );
    }
  }

  async actualizar(body: UpdateEntregaDTO) {
    const detalles = body.detalleEntrega ?? [];
    this.validarDetalleEntrega(detalles, true);

    const ideEntr = IdUtil.requireId(
      body.cabeceraEntrega.ideEntr,
      'El ID de la entrega no es válido.',
    );

    try {
      const entrega = await this.dataSource.transaction(async (manager) => {
        const entregaActual =
          await this.entregasRepository.buscarPorIdForUpdate(ideEntr, manager);

        if (!entregaActual) {
          throw new NotFoundException('No se encontró la entrega indicada.');
        }

        const detallesActuales =
          await this.entregasRepository.listarDetallesPorEntrega(
            ideEntr,
            manager,
          );

        const pedidoAnterior = await this.entregasRepository.buscarPedidoPorId(
          entregaActual.idePedi,
          manager,
        );

        if (!pedidoAnterior) {
          throw new BadRequestException(
            'El pedido original de la entrega ya no existe.',
          );
        }

        const pedidoNuevo = await this.validarPedidoYProveedor(
          body.cabeceraEntrega.idePedi,
          body.cabeceraEntrega.ideProv,
          manager,
        );

        const movimientoAnterior = this.obtenerMovimientoEntrega(
          pedidoAnterior,
          entregaActual.estadoEntr,
        );

        const movimientoNuevo = this.obtenerMovimientoEntrega(
          pedidoNuevo,
          body.cabeceraEntrega.estadoEntr,
        );

        await this.ajustarStockPorCambioDeEntrega(
          this.consolidarCantidadesPorProducto(detallesActuales),
          movimientoAnterior,
          this.consolidarCantidadesPorProducto(detalles),
          movimientoNuevo,
          manager,
        );

        const totales = this.calcularTotalesDesdeDetalle(
          detalles,
          body.cabeceraEntrega,
        );

        const entregaActualizada =
          await this.entregasRepository.actualizarEntrega(
            entregaActual,
            body.cabeceraEntrega,
            totales,
            manager,
          );

        await this.entregasRepository.reemplazarDetalles(
          entregaActualizada.ideEntr,
          detalles,
          manager,
        );

        return entregaActualizada;
      });

      return ApiResponseFactory.legacyWrite(
        1,
        'Entrega actualizada correctamente',
        entrega.ideEntr,
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo actualizar la entrega.',
      );
    }
  }

  async eliminar(id: number) {
    const ideEntr = IdUtil.requireId(id, 'El ID de la entrega no es válido.');

    try {
      const affected = await this.dataSource.transaction(async (manager) => {
        const entregaActual =
          await this.entregasRepository.buscarPorIdForUpdate(ideEntr, manager);

        if (!entregaActual) {
          return 0;
        }

        const detallesActuales =
          await this.entregasRepository.listarDetallesPorEntrega(
            ideEntr,
            manager,
          );

        const pedidoAnterior = await this.entregasRepository.buscarPedidoPorId(
          entregaActual.idePedi,
          manager,
        );

        if (!pedidoAnterior) {
          throw new BadRequestException(
            'El pedido original de la entrega ya no existe.',
          );
        }

        const movimientoAnterior = this.obtenerMovimientoEntrega(
          pedidoAnterior,
          entregaActual.estadoEntr,
        );

        await this.ajustarStockPorCambioDeEntrega(
          this.consolidarCantidadesPorProducto(detallesActuales),
          movimientoAnterior,
          new Map<number, number>(),
          0,
          manager,
        );

        return this.entregasRepository.eliminarEntregaConDetalles(
          ideEntr,
          manager,
        );
      });

      if (affected === 0) {
        return ApiResponseFactory.legacyWrite(
          0,
          'No se encontró la entrega indicada.',
        );
      }

      return ApiResponseFactory.legacyWrite(
        1,
        'Entrega eliminada correctamente',
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo eliminar la entrega.',
      );
    }
  }

  /**
   * JOINS
   */
  async listarEntregas() {
    return this.listar();
  }

  async filtrarEntregas(queryParams: FilterEntregaDTO) {
    return this.filtrar(queryParams);
  }

  async listarDetallesEntrega(idEntrega: number) {
    const ideEntr = IdUtil.requireId(
      idEntrega,
      'El ID de la entrega no es válido.',
    );

    const detalles = await this.dataSource.transaction((manager) =>
      this.entregasRepository.listarDetallesPorEntrega(ideEntr, manager),
    );

    return ApiResponseFactory.legacyRead(
      EntregasMapper.toDetalleRows(detalles),
      'Filtrado de detalles de entrega completado',
    );
  }

  /**
   * COMBOS
   */
  async listarComboEstados() {
    return ComboMapper.fromValues(['completo', 'incompleto']);
  }

  private async validarPedidoYProveedor(
    idePediRaw: number,
    ideProvRaw: number,
    manager: EntityManager,
  ): Promise<PedidoEntity> {
    const idePedi = IdUtil.requireId(
      idePediRaw,
      'El ID del pedido no es válido.',
    );

    const ideProv = IdUtil.requireId(
      ideProvRaw,
      'El ID del proveedor no es válido.',
    );

    const pedido = await this.entregasRepository.buscarPedidoPorId(
      idePedi,
      manager,
    );

    if (!pedido) {
      throw new BadRequestException('El pedido seleccionado no existe.');
    }

    const proveedor = await this.entregasRepository.buscarProveedorPorId(
      ideProv,
      manager,
    );

    if (!proveedor) {
      throw new BadRequestException('El proveedor seleccionado no existe.');
    }

    return pedido;
  }

  private obtenerMovimientoEntrega(
    pedido: PedidoEntity,
    estadoEntr: 'completo' | 'incompleto',
  ): MovimientoEntrega {
    if (estadoEntr !== 'completo') {
      return 0;
    }

    return pedido.motivoPedi === 'peticion' ? 1 : -1;
  }

  private validarDetalleEntrega(
    detalles: Array<CreateEntregaDetalleDTO | UpdateEntregaDetalleDTO>,
    obligatorio: boolean,
  ): void {
    if (!Array.isArray(detalles)) {
      throw new BadRequestException('El detalle de entrega no es válido.');
    }

    if (obligatorio && detalles.length === 0) {
      throw new BadRequestException(
        'Debe agregar al menos un producto a la entrega.',
      );
    }

    for (const detalle of detalles) {
      const ideProd = IdUtil.parseId(detalle.ideProd);

      if (ideProd === null) {
        throw new BadRequestException(
          'Todos los detalles deben tener un producto válido.',
        );
      }

      if (
        detalle.cantidadProd === null ||
        detalle.cantidadProd === undefined ||
        Number.isNaN(Number(detalle.cantidadProd)) ||
        Number(detalle.cantidadProd) <= 0
      ) {
        throw new BadRequestException(
          'Todos los detalles deben tener una cantidad válida.',
        );
      }
    }
  }

  private consolidarCantidadesPorProducto(
    detalles: Array<
      CreateEntregaDetalleDTO | UpdateEntregaDetalleDTO | DetalleEntregaEntity
    >,
  ): Map<number, number> {
    const cantidades = new Map<number, number>();

    for (const detalle of detalles) {
      const ideProd = IdUtil.requireId(
        detalle.ideProd,
        'El ID del producto no es válido.',
      );

      const cantidadAnterior = cantidades.get(ideProd) ?? 0;
      cantidades.set(ideProd, cantidadAnterior + detalle.cantidadProd);
    }

    return cantidades;
  }

  private async ajustarStockPorCambioDeEntrega(
    cantidadesAnteriores: Map<number, number>,
    movimientoAnterior: MovimientoEntrega,
    cantidadesNuevas: Map<number, number>,
    movimientoNuevo: MovimientoEntrega,
    manager: EntityManager,
  ): Promise<void> {
    const productosIds = new Set<number>([
      ...cantidadesAnteriores.keys(),
      ...cantidadesNuevas.keys(),
    ]);

    for (const ideProd of productosIds) {
      const cantidadAnterior = cantidadesAnteriores.get(ideProd) ?? 0;
      const cantidadNueva = cantidadesNuevas.get(ideProd) ?? 0;

      const delta =
        movimientoNuevo * cantidadNueva - movimientoAnterior * cantidadAnterior;

      if (delta === 0) {
        continue;
      }

      const producto =
        await this.entregasRepository.buscarProductoPorIdForUpdate(
          ideProd,
          manager,
        );

      if (!producto) {
        throw new BadRequestException(
          `El producto con ID ${ideProd} no existe.`,
        );
      }

      this.validarProductoParaMovimientoNuevo(
        producto,
        cantidadNueva,
        movimientoNuevo,
      );

      const nuevoStock = producto.stockProd + delta;

      if (nuevoStock < 0) {
        throw new BadRequestException(
          `Stock insuficiente para "${producto.nombreProd}". Disponible: ${producto.stockProd}, movimiento solicitado: ${delta}.`,
        );
      }

      producto.stockProd = nuevoStock;
      producto.disponibleProd = producto.stockProd > 0 ? 'si' : 'no';
      producto.usuaActua = 'admin';
      producto.fechaActua = new Date();

      await this.entregasRepository.guardarProducto(producto, manager);
    }
  }

  private validarProductoParaMovimientoNuevo(
    producto: ProductoEntity,
    cantidadNueva: number,
    movimientoNuevo: MovimientoEntrega,
  ): void {
    if (cantidadNueva <= 0 || movimientoNuevo === 0) {
      return;
    }

    if (producto.estadoProd !== 'activo') {
      throw new BadRequestException(
        `El producto "${producto.nombreProd}" no está activo.`,
      );
    }
  }

  private calcularTotalesDesdeDetalle(
    detalles: Array<CreateEntregaDetalleDTO | UpdateEntregaDetalleDTO>,
    cabecera: {
      cantidadTotalEntr: number;
      totalEntr: number;
    },
  ): TotalesEntregaCalculados {
    if (!detalles.length) {
      return {
        cantidadTotalEntr: cabecera.cantidadTotalEntr,
        totalEntr: cabecera.totalEntr,
      };
    }

    return detalles.reduce<TotalesEntregaCalculados>(
      (totales, detalle) => ({
        cantidadTotalEntr: totales.cantidadTotalEntr + detalle.cantidadProd,
        totalEntr: MoneyUtil.add(totales.totalEntr, detalle.totalProd),
      }),
      {
        cantidadTotalEntr: 0,
        totalEntr: 0,
      },
    );
  }
}
