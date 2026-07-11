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
import {
  DetalleEntregaEntity,
  DetalleEntregaLoteEntity,
  DetallePedidoEntity,
  EstadoEntrega,
  PedidoEntity,
  ProductoEntity,
} from '@entities';
import { EnumEstadoEntrega, EnumTipoMovimientoInventario } from '@models';
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

    this.validarDetalleEntrega(detalles, true, body.cabeceraEntrega.estadoEntr);

    try {
      const entrega = await this.dataSource.transaction(async (manager) => {
        const pedido = await this.validarPedidoYProveedor(
          body.cabeceraEntrega.idePedi,
          body.cabeceraEntrega.ideProv,
          manager,
        );

        await this.validarDetallesContraPedidoYPendiente(
          detalles,
          pedido,
          body.cabeceraEntrega.estadoEntr,
          null,
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

        const detallesGuardados =
          await this.entregasRepository.listarDetallesPorEntrega(
            entregaCreada.ideEntr,
            manager,
          );

        await this.aplicarMovimientoLotesEntrega(
          detallesGuardados,
          pedido,
          movimientoNuevo,
          this.obtenerTipoMovimientoNuevo(pedido, movimientoNuevo),
          manager,
        );

        await this.actualizarEstadosPedidoPorEntregas(pedido.idePedi, manager);

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

    this.validarDetalleEntrega(detalles, true, body.cabeceraEntrega.estadoEntr);

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

        await this.validarDetallesContraPedidoYPendiente(
          detalles,
          pedidoNuevo,
          body.cabeceraEntrega.estadoEntr,
          ideEntr,
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

        await this.aplicarMovimientoLotesEntrega(
          detallesActuales,
          pedidoAnterior,
          this.invertirMovimiento(movimientoAnterior),
          EnumTipoMovimientoInventario.ANULACION_ENTREGA,
          manager,
          true,
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

        const detallesGuardados =
          await this.entregasRepository.listarDetallesPorEntrega(
            entregaActualizada.ideEntr,
            manager,
          );

        await this.aplicarMovimientoLotesEntrega(
          detallesGuardados,
          pedidoNuevo,
          movimientoNuevo,
          this.obtenerTipoMovimientoNuevo(pedidoNuevo, movimientoNuevo),
          manager,
        );

        await this.actualizarEstadosPedidoPorEntregas(
          pedidoNuevo.idePedi,
          manager,
        );

        if (pedidoAnterior.idePedi !== pedidoNuevo.idePedi) {
          await this.actualizarEstadosPedidoPorEntregas(
            pedidoAnterior.idePedi,
            manager,
          );
        }

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

        const idePediAnterior = entregaActual.idePedi;

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

        await this.aplicarMovimientoLotesEntrega(
          detallesActuales,
          pedidoAnterior,
          this.invertirMovimiento(movimientoAnterior),
          EnumTipoMovimientoInventario.ANULACION_ENTREGA,
          manager,
          true,
        );

        await this.ajustarStockPorCambioDeEntrega(
          this.consolidarCantidadesPorProducto(detallesActuales),
          movimientoAnterior,
          new Map<number, number>(),
          0,
          manager,
        );

        const eliminados =
          await this.entregasRepository.eliminarEntregaConDetalles(
            ideEntr,
            manager,
          );

        await this.actualizarEstadosPedidoPorEntregas(idePediAnterior, manager);

        return eliminados;
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
    return ComboMapper.fromValues([
      'borrador',
      'parcial',
      'completa',
      'anulada',
    ]);
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

    if (proveedor.ideEmpr !== pedido.ideEmpr) {
      throw new BadRequestException(
        'El proveedor seleccionado no pertenece a la empresa del pedido.',
      );
    }

    if (proveedor.estadoProv && proveedor.estadoProv !== 'activo') {
      throw new BadRequestException(
        'El proveedor seleccionado no está activo.',
      );
    }

    if (pedido.estadoPedi === 'cancelado') {
      throw new BadRequestException(
        'No se puede registrar una entrega sobre un pedido cancelado.',
      );
    }

    if (pedido.estadoPedi === 'cerrado_incompleto') {
      throw new BadRequestException(
        'No se puede registrar una entrega sobre un pedido cerrado incompleto.',
      );
    }

    return pedido;
  }

  private obtenerMovimientoEntrega(
    pedido: PedidoEntity,
    estadoEntr: EstadoEntrega | EnumEstadoEntrega,
  ): MovimientoEntrega {
    if (estadoEntr === 'borrador' || estadoEntr === 'anulada') {
      return 0;
    }

    return pedido.motivoPedi === 'peticion' ? 1 : -1;
  }

  private invertirMovimiento(movimiento: MovimientoEntrega): MovimientoEntrega {
    if (movimiento === 1) {
      return -1;
    }

    if (movimiento === -1) {
      return 1;
    }

    return 0;
  }

  private obtenerTipoMovimientoNuevo(
    pedido: PedidoEntity,
    movimiento: MovimientoEntrega,
  ): EnumTipoMovimientoInventario {
    if (movimiento === 1 && pedido.motivoPedi === 'peticion') {
      return EnumTipoMovimientoInventario.ENTRADA_ENTREGA;
    }

    if (movimiento === -1 && pedido.motivoPedi === 'devolucion') {
      return EnumTipoMovimientoInventario.SALIDA_DEVOLUCION_PROVEEDOR;
    }

    return EnumTipoMovimientoInventario.CORRECCION_LOTE;
  }

  private validarDetalleEntrega(
    detalles: Array<CreateEntregaDetalleDTO | UpdateEntregaDetalleDTO>,
    obligatorio: boolean,
    estadoEntr: EstadoEntrega | EnumEstadoEntrega,
  ): void {
    if (!Array.isArray(detalles)) {
      throw new BadRequestException('El detalle de entrega no es válido.');
    }

    if (obligatorio && detalles.length === 0) {
      throw new BadRequestException(
        'Debe agregar al menos un producto a la entrega.',
      );
    }

    const mueveInventario =
      estadoEntr === 'parcial' || estadoEntr === 'completa';

    const detallesPedidoUsados = new Set<number>();

    for (const detalle of detalles) {
      const ideDetaPedi = IdUtil.parseId(detalle.ideDetaPedi);
      const ideProd = IdUtil.parseId(detalle.ideProd);

      if (ideDetaPedi === null) {
        throw new BadRequestException(
          'Todos los detalles deben estar relacionados con un detalle de pedido válido.',
        );
      }

      if (detallesPedidoUsados.has(ideDetaPedi)) {
        throw new BadRequestException(
          'No se puede repetir el mismo detalle de pedido en una entrega.',
        );
      }

      detallesPedidoUsados.add(ideDetaPedi);

      if (ideProd === null) {
        throw new BadRequestException(
          'Todos los detalles deben tener un producto válido.',
        );
      }

      if (
        detalle.cantidadProd === null ||
        detalle.cantidadProd === undefined ||
        Number.isNaN(Number(detalle.cantidadProd)) ||
        Number(detalle.cantidadProd) < 0
      ) {
        throw new BadRequestException(
          'Todos los detalles deben tener una cantidad válida.',
        );
      }

      if (
        detalle.estadoDetaEntr !== 'no_entregado' &&
        Number(detalle.cantidadProd) <= 0
      ) {
        throw new BadRequestException(
          'Los detalles entregados deben tener cantidad mayor a cero.',
        );
      }

      if (
        mueveInventario &&
        detalle.estadoDetaEntr !== 'no_entregado' &&
        Number(detalle.cantidadProd) > 0 &&
        !detalle.lotesRecibidos?.length
      ) {
        throw new BadRequestException(
          'Toda entrega parcial o completa debe registrar lotes recibidos por cada producto entregado.',
        );
      }

      if (detalle.lotesRecibidos?.length) {
        const totalLotes = detalle.lotesRecibidos.reduce(
          (total, lote) => total + Number(lote.cantidadLote ?? 0),
          0,
        );

        if (totalLotes !== Number(detalle.cantidadProd)) {
          throw new BadRequestException(
            'La suma de lotes recibidos debe coincidir con la cantidad recibida del producto.',
          );
        }
      }
    }
  }

  private async validarDetallesContraPedidoYPendiente(
    detalles: Array<CreateEntregaDetalleDTO | UpdateEntregaDetalleDTO>,
    pedido: PedidoEntity,
    estadoEntr: EstadoEntrega | EnumEstadoEntrega,
    excluirIdeEntr: number | null,
    manager: EntityManager,
  ): Promise<void> {
    if (!pedido.detalles?.length) {
      throw new BadRequestException(
        'El pedido seleccionado no tiene detalles registrados.',
      );
    }

    const detallesPedido = new Map<number, DetallePedidoEntity>();

    for (const detallePedido of pedido.detalles) {
      detallesPedido.set(detallePedido.ideDetaPedi, detallePedido);
    }

    const cantidadesConfirmadasRows =
      await this.entregasRepository.obtenerCantidadesConfirmadasPorPedido(
        pedido.idePedi,
        excluirIdeEntr,
        manager,
      );

    const cantidadesConfirmadas = new Map<number, number>();

    for (const row of cantidadesConfirmadasRows) {
      cantidadesConfirmadas.set(
        Number(row.ide_deta_pedi),
        Number(row.cantidad_confirmada),
      );
    }

    const cantidadesNuevas = new Map<number, number>();
    const mueveInventario =
      estadoEntr === 'parcial' || estadoEntr === 'completa';

    for (const detalle of detalles) {
      const ideDetaPedi = IdUtil.requireId(
        detalle.ideDetaPedi,
        'El detalle de pedido de la entrega no es válido.',
      );

      const detallePedido = detallesPedido.get(ideDetaPedi);

      if (!detallePedido) {
        throw new BadRequestException(
          `El detalle de pedido ${ideDetaPedi} no pertenece al pedido seleccionado.`,
        );
      }

      if (detallePedido.ideProd !== detalle.ideProd) {
        throw new BadRequestException(
          `El producto del detalle de entrega no coincide con el producto del detalle de pedido ${ideDetaPedi}.`,
        );
      }

      if (
        detallePedido.estadoDetaPedi === 'cancelado' ||
        detallePedido.estadoDetaPedi === 'cerrado_incompleto'
      ) {
        throw new BadRequestException(
          `El detalle de pedido ${ideDetaPedi} no puede recibir entregas porque está ${detallePedido.estadoDetaPedi}.`,
        );
      }

      const cantidadAnterior = cantidadesNuevas.get(ideDetaPedi) ?? 0;
      cantidadesNuevas.set(
        ideDetaPedi,
        cantidadAnterior + (mueveInventario ? Number(detalle.cantidadProd) : 0),
      );
    }

    for (const [ideDetaPedi, cantidadNueva] of cantidadesNuevas.entries()) {
      const detallePedido = detallesPedido.get(ideDetaPedi);

      if (!detallePedido) {
        continue;
      }

      const cantidadYaConfirmada = cantidadesConfirmadas.get(ideDetaPedi) ?? 0;
      const cantidadTotalConfirmada = cantidadYaConfirmada + cantidadNueva;

      if (cantidadTotalConfirmada > detallePedido.cantidadProd) {
        const pendiente = Math.max(
          detallePedido.cantidadProd - cantidadYaConfirmada,
          0,
        );

        throw new BadRequestException(
          `No se puede recibir más de lo pedido para "${detallePedido.producto?.nombreProd ?? `producto ${detallePedido.ideProd}`}". Pedido: ${detallePedido.cantidadProd}, ya confirmado: ${cantidadYaConfirmada}, pendiente: ${pendiente}, recibido ahora: ${cantidadNueva}.`,
        );
      }
    }
  }

  private async actualizarEstadosPedidoPorEntregas(
    idePedi: number,
    manager: EntityManager,
  ): Promise<void> {
    const pedido = await this.entregasRepository.buscarPedidoPorId(
      idePedi,
      manager,
    );

    if (!pedido) {
      return;
    }

    if (
      pedido.estadoPedi === 'cancelado' ||
      pedido.estadoPedi === 'cerrado_incompleto'
    ) {
      return;
    }

    const cantidadesConfirmadasRows =
      await this.entregasRepository.obtenerCantidadesConfirmadasPorPedido(
        idePedi,
        null,
        manager,
      );

    const cantidadesConfirmadas = new Map<number, number>();

    for (const row of cantidadesConfirmadasRows) {
      cantidadesConfirmadas.set(
        Number(row.ide_deta_pedi),
        Number(row.cantidad_confirmada),
      );
    }

    let tieneParcial = false;
    let todosCompletos = true;

    for (const detallePedido of pedido.detalles ?? []) {
      if (
        detallePedido.estadoDetaPedi === 'cancelado' ||
        detallePedido.estadoDetaPedi === 'cerrado_incompleto'
      ) {
        continue;
      }

      const recibido =
        cantidadesConfirmadas.get(detallePedido.ideDetaPedi) ?? 0;

      if (recibido <= 0) {
        detallePedido.estadoDetaPedi = 'pendiente';
        todosCompletos = false;
      } else if (recibido < detallePedido.cantidadProd) {
        detallePedido.estadoDetaPedi = 'parcial';
        tieneParcial = true;
        todosCompletos = false;
      } else {
        detallePedido.estadoDetaPedi = 'completo';
        tieneParcial = true;
      }

      await this.entregasRepository.guardarDetallePedido(
        detallePedido,
        manager,
      );
    }

    if (todosCompletos && pedido.detalles?.length) {
      pedido.estadoPedi = 'completado';
    } else if (tieneParcial) {
      pedido.estadoPedi = 'parcial';
    } else {
      pedido.estadoPedi = 'emitido';
    }

    pedido.usuaActua = 'admin';
    pedido.fechaActua = new Date();

    await this.entregasRepository.guardarPedido(pedido, manager);
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

  private async aplicarMovimientoLotesEntrega(
    detalles: DetalleEntregaEntity[],
    pedido: PedidoEntity,
    movimiento: MovimientoEntrega,
    tipoMovi: EnumTipoMovimientoInventario,
    manager: EntityManager,
    esReversion = false,
  ): Promise<void> {
    if (movimiento === 0) {
      return;
    }

    for (const detalle of detalles) {
      if (!detalle.lotesRecibidos?.length) {
        continue;
      }

      for (const detalleLote of detalle.lotesRecibidos) {
        await this.aplicarMovimientoLoteIndividual(
          detalle,
          detalleLote,
          pedido,
          movimiento,
          tipoMovi,
          manager,
          esReversion,
        );
      }
    }
  }

  private async aplicarMovimientoLoteIndividual(
    detalle: DetalleEntregaEntity,
    detalleLote: DetalleEntregaLoteEntity,
    pedido: PedidoEntity,
    movimiento: MovimientoEntrega,
    tipoMovi: EnumTipoMovimientoInventario,
    manager: EntityManager,
    esReversion: boolean,
  ): Promise<void> {
    const fechaCaducidad = this.toDateOnly(detalleLote.fechaCaducidadLote);
    const cantidadMovimiento = detalleLote.cantidadLote * movimiento;

    let lote =
      await this.entregasRepository.buscarLotePorProductoYFechaForUpdate(
        detalle.ideProd,
        fechaCaducidad,
        manager,
      );

    if (!lote) {
      if (cantidadMovimiento < 0) {
        throw new BadRequestException(
          `No existe un lote para el producto ${detalle.ideProd} con caducidad ${fechaCaducidad}.`,
        );
      }

      lote = await this.entregasRepository.crearLote(
        detalle.ideProd,
        fechaCaducidad,
        0,
        manager,
      );
    }

    const stockLoteAnterior = lote.stockLote;
    const stockLotePosterior = stockLoteAnterior + cantidadMovimiento;

    if (stockLotePosterior < 0) {
      throw new BadRequestException(
        `Stock insuficiente en lote ${lote.ideLote}. Disponible: ${stockLoteAnterior}, movimiento solicitado: ${cantidadMovimiento}.`,
      );
    }

    lote.stockLote = stockLotePosterior;

    const loteGuardado = await this.entregasRepository.guardarLote(
      lote,
      manager,
    );

    detalleLote.ideLote = loteGuardado.ideLote;
    detalleLote.estadoDetaEntrLote = esReversion ? 'anulado' : 'confirmado';
    detalleLote.fechaActua = new Date();
    detalleLote.usuaActua = 'admin';

    await manager.getRepository(DetalleEntregaLoteEntity).save(detalleLote);

    await this.entregasRepository.registrarMovimientoInventario(
      {
        ideProd: detalle.ideProd,
        ideLote: loteGuardado.ideLote,
        ideDetaEntr: detalle.ideDetaEntr,
        ideDetaVent: null,
        tipoMovi,
        cantidadMovi: cantidadMovimiento,
        stockProdAnterior: null,
        stockProdPosterior: null,
        stockLoteAnterior,
        stockLotePosterior,
        observacionMovi: this.obtenerObservacionMovimiento(
          pedido,
          detalle,
          fechaCaducidad,
          esReversion,
        ),
        usuaIngre: 'admin',
      },
      manager,
    );
  }

  private obtenerObservacionMovimiento(
    pedido: PedidoEntity,
    detalle: DetalleEntregaEntity,
    fechaCaducidad: string,
    esReversion: boolean,
  ): string {
    const accion = esReversion
      ? 'Reverso de entrega'
      : 'Confirmación de entrega';

    return `${accion}. Pedido ${pedido.idePedi}, detalle entrega ${detalle.ideDetaEntr}, producto ${detalle.ideProd}, caducidad ${fechaCaducidad}.`;
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

  private toDateOnly(value: Date | string): string {
    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value).slice(0, 10);
    }

    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000,
    );

    return localDate.toISOString().slice(0, 10);
  }
}
