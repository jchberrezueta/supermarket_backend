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
import {
  EnumEstadoDetalleEntrega,
  EnumEstadoDetalleEntregaLote,
  EnumEstadoEntrega,
  EnumTipoMovimientoInventario,
} from '@models';
import { DataSource, EntityManager } from 'typeorm';
import { AnularEntregaDTO } from './dto/anular_entrega.dto';
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

interface AjusteStockProducto {
  stockAnterior: number;
  stockPosterior: number;
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

    /**
     * La inserción siempre trabaja como borrador.
     * Ignoramos cualquier otro estado recibido desde el cliente.
     */
    body.cabeceraEntrega.estadoEntr = EnumEstadoEntrega.BORRADOR;

    this.validarDetalleEntrega(detalles, true, EnumEstadoEntrega.BORRADOR);

    try {
      const entrega = await this.dataSource.transaction(async (manager) => {
        const pedido = await this.validarPedidoYProveedor(
          body.cabeceraEntrega.idePedi,
          body.cabeceraEntrega.ideProv,
          manager,
        );

        /**
         * Aunque todavía sea borrador, validamos que:
         * - el detalle pertenezca al pedido;
         * - el producto coincida;
         * - no exceda la cantidad pendiente.
         */
        await this.validarDetallesContraPedidoYPendiente(
          detalles,
          pedido,
          EnumEstadoEntrega.BORRADOR,
          null,
          manager,
        );

        /**
         * Los importes enviados por el frontend se descartan.
         * La entrega hereda sus valores del detalle del pedido.
         */
        await this.aplicarValoresEconomicosPedidoADetalles(
          detalles,
          pedido,
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

        /**
         * Aquí no se toca:
         * - producto.stock_prod
         * - lote.stock_lote
         * - movimiento_inventario
         * - estado del pedido
         *
         * Eso ocurre exclusivamente en confirmar().
         */

        return entregaCreada;
      });

      return ApiResponseFactory.legacyWrite(
        1,
        'Entrega guardada como borrador correctamente.',
        entrega.ideEntr,
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo guardar la entrega.',
      );
    }
  }

  async actualizar(body: UpdateEntregaDTO) {
    const detalles = body.detalleEntrega ?? [];

    body.cabeceraEntrega.estadoEntr = EnumEstadoEntrega.BORRADOR;

    this.validarDetalleEntrega(detalles, true, EnumEstadoEntrega.BORRADOR);

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

        /**
         * Una entrega que ya afectó inventario no puede editarse.
         * Debe anularse para generar la trazabilidad inversa.
         */
        if (entregaActual.estadoEntr !== 'borrador') {
          throw new BadRequestException(
            `La entrega no puede modificarse porque se encuentra en estado "${entregaActual.estadoEntr}".`,
          );
        }

        const pedido = await this.validarPedidoYProveedor(
          body.cabeceraEntrega.idePedi,
          body.cabeceraEntrega.ideProv,
          manager,
        );

        await this.validarDetallesContraPedidoYPendiente(
          detalles,
          pedido,
          EnumEstadoEntrega.BORRADOR,
          null,
          manager,
        );

        /**
         * Cada edición del borrador vuelve a calcular
         * sus importes desde el pedido original.
         */
        await this.aplicarValoresEconomicosPedidoADetalles(
          detalles,
          pedido,
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

        /**
         * Como continúa en borrador, no se generan movimientos.
         */

        return entregaActualizada;
      });

      return ApiResponseFactory.legacyWrite(
        1,
        'Borrador de entrega actualizado correctamente.',
        entrega.ideEntr,
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo actualizar la entrega.',
      );
    }
  }

  async confirmar(id: number) {
    const ideEntr = IdUtil.requireId(id, 'El ID de la entrega no es válido.');

    try {
      const entregaConfirmada = await this.dataSource.transaction(
        async (manager) => {
          const entrega = await this.entregasRepository.buscarPorIdForUpdate(
            ideEntr,
            manager,
          );

          if (!entrega) {
            throw new NotFoundException('No se encontró la entrega indicada.');
          }

          if (entrega.estadoEntr !== 'borrador') {
            throw new BadRequestException(
              `La entrega no puede confirmarse porque se encuentra en estado "${entrega.estadoEntr}".`,
            );
          }

          /**
           * El pedido y el proveedor se vuelven a validar
           * porque pudieron cambiar después de crear el borrador.
           */
          const pedido = await this.validarPedidoYProveedor(
            entrega.idePedi,
            entrega.ideProv,
            manager,
          );

          const detalles =
            await this.entregasRepository.listarDetallesPorEntrega(
              ideEntr,
              manager,
            );

          if (!detalles.length) {
            throw new BadRequestException(
              'La entrega no tiene productos registrados.',
            );
          }

          const detallesValidacion =
            this.mapearEntidadesDetalleParaValidacion(detalles);

          /**
           * Usamos PARCIAL para activar las validaciones
           * propias de una confirmación:
           * - cantidades positivas requieren lotes;
           * - cantidad cero no admite lotes.
           */
          this.validarDetalleEntrega(
            detallesValidacion,
            true,
            EnumEstadoEntrega.PARCIAL,
          );

          /**
           * Este método calcula automáticamente:
           * - no_entregado
           * - incompleto
           * - completo
           */
          await this.validarDetallesContraPedidoYPendiente(
            detallesValidacion,
            pedido,
            EnumEstadoEntrega.PARCIAL,
            null,
            manager,
          );

          /**
           * Volvemos a calcular los importes justo antes de confirmar.
           *
           * Esto permite distribuir correctamente los centavos
           * cuando un pedido es recibido en varias entregas.
           */
          await this.aplicarValoresEconomicosPedidoADetalles(
            detallesValidacion,
            pedido,
            manager,
          );

          /**
           * Persistimos los estados calculados por el backend.
           */
          await this.sincronizarDetallesEntregaCalculados(
            detalles,
            detallesValidacion,
            manager,
          );

          /**
           * La entrega será completa solamente cuando,
           * después de esta recepción, todo el pedido quede cubierto.
           */
          const estadoConfirmado = this.determinarEstadoConfirmadoEntrega(
            detallesValidacion,
            pedido,
          );

          const totalesConfirmados = this.calcularTotalesDesdeDetalle(
            detallesValidacion,
            {
              cantidadTotalEntr: 0,
              totalEntr: 0,
            },
          );

          entrega.cantidadTotalEntr = totalesConfirmados.cantidadTotalEntr;

          entrega.totalEntr = MoneyUtil.toMoneyString(
            totalesConfirmados.totalEntr,
          );

          const movimiento = this.obtenerMovimientoEntrega(
            pedido,
            estadoConfirmado,
          );

          /**
           * Primero actualizamos y capturamos el cambio total
           * del stock general de cada producto.
           */
          const ajustesStockProducto =
            await this.ajustarStockPorCambioDeEntrega(
              new Map<number, number>(),
              0,
              this.consolidarCantidadesPorProducto(detalles),
              movimiento,
              manager,
            );

          /**
           * Después distribuimos ese cambio entre los lotes,
           * registrando en cada movimiento:
           *
           * - stock general anterior y posterior;
           * - stock del lote anterior y posterior.
           */
          await this.aplicarMovimientoLotesEntrega(
            detalles,
            pedido,
            movimiento,
            this.obtenerTipoMovimientoNuevo(pedido, movimiento),
            ajustesStockProducto,
            manager,
          );
          entrega.estadoEntr = estadoConfirmado;
          entrega.usuaActua = 'admin';
          entrega.fechaActua = new Date();

          await this.entregasRepository.guardarEntrega(entrega, manager);

          await this.actualizarEstadosPedidoPorEntregas(
            pedido.idePedi,
            manager,
          );

          return entrega;
        },
      );

      return ApiResponseFactory.legacyWrite(
        1,
        `Entrega confirmada como ${entregaConfirmada.estadoEntr}.`,
        entregaConfirmada.ideEntr,
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo confirmar la entrega.',
      );
    }
  }
  async anular(id: number, body: AnularEntregaDTO) {
    const ideEntr = IdUtil.requireId(id, 'El ID de la entrega no es válido.');

    try {
      const entregaAnulada = await this.dataSource.transaction(
        async (manager) => {
          const entrega = await this.entregasRepository.buscarPorIdForUpdate(
            ideEntr,
            manager,
          );

          if (!entrega) {
            throw new NotFoundException('No se encontró la entrega indicada.');
          }

          if (
            entrega.estadoEntr !== 'parcial' &&
            entrega.estadoEntr !== 'completa'
          ) {
            throw new BadRequestException(
              `La entrega no puede anularse porque se encuentra en estado "${entrega.estadoEntr}".`,
            );
          }

          const pedido = await this.entregasRepository.buscarPedidoPorId(
            entrega.idePedi,
            manager,
          );

          if (!pedido) {
            throw new BadRequestException(
              'El pedido relacionado con la entrega no existe.',
            );
          }

          const detalles =
            await this.entregasRepository.listarDetallesPorEntrega(
              ideEntr,
              manager,
            );

          if (!detalles.length) {
            throw new BadRequestException(
              'La entrega no tiene detalles para revertir.',
            );
          }

          const movimientoAnterior = this.obtenerMovimientoEntrega(
            pedido,
            entrega.estadoEntr,
          );

          const movimientoReversion =
            this.invertirMovimiento(movimientoAnterior);

          /**
           * Actualizamos primero el stock general y conservamos
           * sus valores anterior y posterior.
           *
           * Todo permanece dentro de la misma transacción:
           * si falla un lote, PostgreSQL revierte también el producto.
           */
          const ajustesStockProducto =
            await this.ajustarStockPorCambioDeEntrega(
              this.consolidarCantidadesPorProducto(detalles),
              movimientoAnterior,
              new Map<number, number>(),
              0,
              manager,
            );

          await this.aplicarMovimientoLotesEntrega(
            detalles,
            pedido,
            movimientoReversion,
            EnumTipoMovimientoInventario.ANULACION_ENTREGA,
            ajustesStockProducto,
            manager,
            true,
          );

          entrega.estadoEntr = 'anulada';
          entrega.observacionEntr = this.construirObservacionAnulacion(
            entrega.observacionEntr,
            body.motivoAnulacion,
          );
          entrega.usuaActua = 'admin';
          entrega.fechaActua = new Date();

          await this.entregasRepository.guardarEntrega(entrega, manager);

          await this.actualizarEstadosPedidoPorEntregas(
            pedido.idePedi,
            manager,
          );

          return entrega;
        },
      );

      return ApiResponseFactory.legacyWrite(
        1,
        'Entrega anulada y movimientos de inventario revertidos correctamente.',
        entregaAnulada.ideEntr,
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo anular la entrega.',
      );
    }
  }

  async eliminar(id: number) {
    const ideEntr = IdUtil.requireId(id, 'El ID de la entrega no es válido.');

    try {
      const affected = await this.dataSource.transaction(async (manager) => {
        const entrega = await this.entregasRepository.buscarPorIdForUpdate(
          ideEntr,
          manager,
        );

        if (!entrega) {
          return 0;
        }

        /**
         * Las entregas confirmadas no se eliminan físicamente.
         * Se deben anular mediante el endpoint formal.
         */
        if (entrega.estadoEntr !== 'borrador') {
          throw new BadRequestException(
            `La entrega no puede eliminarse porque se encuentra en estado "${entrega.estadoEntr}". Utilice la opción de anulación.`,
          );
        }

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
        'Borrador de entrega eliminado correctamente.',
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

    /**
     * Únicamente los pedidos abiertos pueden recibir productos.
     */
    if (pedido.estadoPedi !== 'emitido' && pedido.estadoPedi !== 'parcial') {
      throw new BadRequestException(
        `El pedido no admite entregas porque se encuentra en estado "${pedido.estadoPedi}". Solo los pedidos emitidos o parciales pueden recibir productos.`,
      );
    }

    const proveedor = await this.entregasRepository.buscarProveedorPorId(
      ideProv,
      manager,
    );

    if (!proveedor) {
      throw new BadRequestException('El proveedor seleccionado no existe.');
    }

    if (proveedor.estadoProv !== 'activo') {
      throw new BadRequestException(
        'El proveedor seleccionado se encuentra inactivo.',
      );
    }

    /**
     * El contacto que realiza la entrega debe pertenecer
     * a la misma empresa del pedido.
     */
    if (proveedor.ideEmpr !== pedido.ideEmpr) {
      throw new BadRequestException(
        'El proveedor seleccionado no pertenece a la empresa del pedido.',
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

    const requiereLotes = estadoEntr === 'parcial' || estadoEntr === 'completa';

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

      const cantidad = Number(detalle.cantidadProd);

      if (!Number.isInteger(cantidad) || cantidad < 0) {
        throw new BadRequestException(
          'Todos los detalles deben tener una cantidad entera igual o mayor a cero.',
        );
      }

      const lotes = detalle.lotesRecibidos ?? [];

      /**
       * Cantidad cero siempre significa no entregado.
       * El estado recibido desde el frontend se ignora.
       */
      if (cantidad === 0) {
        detalle.estadoDetaEntr = EnumEstadoDetalleEntrega.NO_ENTREGADO;

        if (lotes.length > 0) {
          throw new BadRequestException(
            `El producto ${ideProd} está marcado sin unidades recibidas y no puede contener lotes.`,
          );
        }

        continue;
      }

      /**
       * Es un estado provisional.
       * Luego se recalcula contra la cantidad pendiente.
       */
      detalle.estadoDetaEntr = EnumEstadoDetalleEntrega.INCOMPLETO;

      if (requiereLotes && lotes.length === 0) {
        throw new BadRequestException(
          `El producto ${ideProd} tiene ${cantidad} unidades recibidas y debe registrar al menos un lote.`,
        );
      }

      if (!lotes.length) {
        continue;
      }

      const fechasRegistradas = new Set<string>();

      let totalLotes = 0;

      for (const lote of lotes) {
        const cantidadLote = Number(lote.cantidadLote);

        if (!Number.isInteger(cantidadLote) || cantidadLote <= 0) {
          throw new BadRequestException(
            `Todos los lotes del producto ${ideProd} deben tener una cantidad entera mayor a cero.`,
          );
        }

        const fechaCaducidad = this.toDateOnly(lote.fechaCaducidadLote);

        if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaCaducidad)) {
          throw new BadRequestException(
            `El producto ${ideProd} contiene una fecha de caducidad no válida.`,
          );
        }

        if (fechasRegistradas.has(fechaCaducidad)) {
          throw new BadRequestException(
            `El producto ${ideProd} contiene dos lotes con la misma fecha de caducidad: ${fechaCaducidad}. Debe registrar una sola línea y acumular la cantidad.`,
          );
        }

        fechasRegistradas.add(fechaCaducidad);

        totalLotes += cantidadLote;
      }

      if (totalLotes !== cantidad) {
        throw new BadRequestException(
          `La suma de lotes del producto ${ideProd} es ${totalLotes}, pero la cantidad recibida es ${cantidad}.`,
        );
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

    /**
     * Se mantiene en la firma porque forma parte
     * del flujo de validación de entrega.
     */
    void estadoEntr;

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
        detallePedido.estadoDetaPedi !== 'pendiente' &&
        detallePedido.estadoDetaPedi !== 'parcial'
      ) {
        throw new BadRequestException(
          `El detalle de pedido ${ideDetaPedi} no admite nuevas entregas porque se encuentra en estado "${detallePedido.estadoDetaPedi}".`,
        );
      }

      const cantidadNueva = Number(detalle.cantidadProd);

      const cantidadYaConfirmada = cantidadesConfirmadas.get(ideDetaPedi) ?? 0;

      const cantidadPendiente = Math.max(
        detallePedido.cantidadProd - cantidadYaConfirmada,
        0,
      );

      if (cantidadNueva > cantidadPendiente) {
        throw new BadRequestException(
          `No se puede recibir más de lo pendiente para "${detallePedido.producto?.nombreProd ?? `producto ${detallePedido.ideProd}`}". Pedido: ${detallePedido.cantidadProd}, ya confirmado: ${cantidadYaConfirmada}, pendiente: ${cantidadPendiente}, recibido ahora: ${cantidadNueva}.`,
        );
      }

      /**
       * El backend es la única autoridad del estado.
       */
      if (cantidadNueva === 0) {
        detalle.estadoDetaEntr = EnumEstadoDetalleEntrega.NO_ENTREGADO;

        continue;
      }

      if (cantidadNueva === cantidadPendiente) {
        detalle.estadoDetaEntr = EnumEstadoDetalleEntrega.COMPLETO;

        continue;
      }

      detalle.estadoDetaEntr = EnumEstadoDetalleEntrega.INCOMPLETO;
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
      const cantidad = Number(detalle.cantidadProd);

      /**
       * Defensa adicional:
       * no entregado nunca modifica inventario.
       */
      if (detalle.estadoDetaEntr === 'no_entregado' || cantidad <= 0) {
        continue;
      }

      const ideProd = IdUtil.requireId(
        detalle.ideProd,
        'El ID del producto no es válido.',
      );

      const cantidadAnterior = cantidades.get(ideProd) ?? 0;

      cantidades.set(ideProd, cantidadAnterior + cantidad);
    }

    return cantidades;
  }

  private async ajustarStockPorCambioDeEntrega(
    cantidadesAnteriores: Map<number, number>,
    movimientoAnterior: MovimientoEntrega,
    cantidadesNuevas: Map<number, number>,
    movimientoNuevo: MovimientoEntrega,
    manager: EntityManager,
  ): Promise<Map<number, AjusteStockProducto>> {
    const ajustes = new Map<number, AjusteStockProducto>();

    const productosIds = new Set<number>([
      ...cantidadesAnteriores.keys(),
      ...cantidadesNuevas.keys(),
    ]);

    /**
     * Orden estable para adquirir bloqueos siempre
     * en el mismo orden y disminuir riesgo de deadlocks.
     */
    const productosOrdenados = Array.from(productosIds).sort((a, b) => a - b);

    for (const ideProd of productosOrdenados) {
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

      const stockAnterior = Number(producto.stockProd);

      const stockPosterior = stockAnterior + delta;

      if (stockPosterior < 0) {
        throw new BadRequestException(
          `Stock insuficiente para "${producto.nombreProd}". Disponible: ${stockAnterior}, movimiento solicitado: ${delta}.`,
        );
      }

      producto.stockProd = stockPosterior;

      producto.disponibleProd = stockPosterior > 0 ? 'si' : 'no';

      producto.usuaActua = 'admin';

      producto.fechaActua = new Date();

      await this.entregasRepository.guardarProducto(producto, manager);

      ajustes.set(ideProd, {
        stockAnterior,
        stockPosterior,
      });
    }

    return ajustes;
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
    ajustesStockProducto: Map<number, AjusteStockProducto>,
    manager: EntityManager,
    esReversion = false,
  ): Promise<void> {
    if (movimiento === 0) {
      return;
    }

    /**
     * Cada producto comienza en el stock que tenía
     * antes de aplicar esta operación.
     */
    const cursoresStockProducto = new Map<number, number>();

    for (const [ideProd, ajuste] of ajustesStockProducto) {
      cursoresStockProducto.set(ideProd, ajuste.stockAnterior);
    }

    /**
     * Ordenamos los detalles para generar una secuencia
     * determinista en la trazabilidad.
     */
    const detallesOrdenados = [...detalles].sort(
      (a, b) => a.ideDetaEntr - b.ideDetaEntr,
    );

    for (const detalle of detallesOrdenados) {
      if (
        detalle.estadoDetaEntr === 'no_entregado' ||
        Number(detalle.cantidadProd) <= 0 ||
        !detalle.lotesRecibidos?.length
      ) {
        continue;
      }

      const ajusteProducto = ajustesStockProducto.get(detalle.ideProd);

      if (!ajusteProducto) {
        throw new BadRequestException(
          `No se encontró el ajuste de stock general para el producto ${detalle.ideProd}.`,
        );
      }

      const lotesOrdenados = [...detalle.lotesRecibidos].sort(
        (a, b) => a.ideDetaEntrLote - b.ideDetaEntrLote,
      );

      for (const detalleLote of lotesOrdenados) {
        const stockProdAnterior =
          cursoresStockProducto.get(detalle.ideProd) ??
          ajusteProducto.stockAnterior;

        const stockProdPosterior = await this.aplicarMovimientoLoteIndividual(
          detalle,
          detalleLote,
          pedido,
          movimiento,
          tipoMovi,
          stockProdAnterior,
          manager,
          esReversion,
        );

        cursoresStockProducto.set(detalle.ideProd, stockProdPosterior);
      }
    }

    /**
     * Verificación interna:
     *
     * la suma de movimientos por lote debe terminar
     * exactamente en el stock general ya calculado.
     *
     * Si no coincide, la transacción completa se revierte.
     */
    for (const [ideProd, ajuste] of ajustesStockProducto) {
      const stockCalculado =
        cursoresStockProducto.get(ideProd) ?? ajuste.stockAnterior;

      if (stockCalculado !== ajuste.stockPosterior) {
        throw new BadRequestException(
          `La trazabilidad del producto ${ideProd} no coincide con el stock general. Stock calculado por lotes: ${stockCalculado}, stock esperado: ${ajuste.stockPosterior}.`,
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
    stockProdAnterior: number,
    manager: EntityManager,
    esReversion: boolean,
  ): Promise<number> {
    const fechaCaducidad = this.toDateOnly(detalleLote.fechaCaducidadLote);

    const cantidadMovimiento = Number(detalleLote.cantidadLote) * movimiento;

    const stockProdPosterior = stockProdAnterior + cantidadMovimiento;

    if (stockProdPosterior < 0) {
      throw new BadRequestException(
        `La operación dejaría el stock general del producto ${detalle.ideProd} en negativo.`,
      );
    }

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

    const stockLoteAnterior = Number(lote.stockLote);

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

        /**
         * Trazabilidad del stock general.
         */
        stockProdAnterior,
        stockProdPosterior,

        /**
         * Trazabilidad del lote.
         */
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

    return stockProdPosterior;
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

  private async aplicarValoresEconomicosPedidoADetalles(
    detalles: Array<CreateEntregaDetalleDTO | UpdateEntregaDetalleDTO>,
    pedido: PedidoEntity,
    manager: EntityManager,
  ): Promise<void> {
    if (!pedido.detalles?.length) {
      throw new BadRequestException(
        'El pedido no contiene detalles para calcular los valores de la entrega.',
      );
    }

    const detallesPedido = new Map<number, DetallePedidoEntity>();

    for (const detallePedido of pedido.detalles) {
      detallesPedido.set(detallePedido.ideDetaPedi, detallePedido);
    }

    /**
     * Conocer la cantidad ya confirmada permite distribuir
     * correctamente los centavos entre varias entregas.
     */
    const cantidadesConfirmadasRows =
      await this.entregasRepository.obtenerCantidadesConfirmadasPorPedido(
        pedido.idePedi,
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
          `El producto del detalle de entrega no coincide con el detalle de pedido ${ideDetaPedi}.`,
        );
      }

      const cantidadPedido = Number(detallePedido.cantidadProd);

      const cantidadRecibida = Number(detalle.cantidadProd);

      const cantidadYaConfirmada = cantidadesConfirmadas.get(ideDetaPedi) ?? 0;

      if (!Number.isInteger(cantidadPedido) || cantidadPedido <= 0) {
        throw new BadRequestException(
          `El detalle de pedido ${ideDetaPedi} tiene una cantidad solicitada inválida.`,
        );
      }

      if (!Number.isInteger(cantidadRecibida) || cantidadRecibida < 0) {
        throw new BadRequestException(
          `El detalle de entrega relacionado con ${ideDetaPedi} tiene una cantidad inválida.`,
        );
      }

      if (cantidadYaConfirmada + cantidadRecibida > cantidadPedido) {
        throw new BadRequestException(
          `La cantidad recibida para el detalle ${ideDetaPedi} supera la cantidad solicitada.`,
        );
      }

      /**
       * El precio unitario siempre se copia directamente
       * desde el pedido.
       */
      detalle.precioUnitarioProd = MoneyUtil.toNumber(
        detallePedido.precioUnitarioProd,
      );

      /**
       * Los demás valores representan importes de línea
       * y se distribuyen por el tramo de unidades recibido.
       */
      detalle.subtotalProd = this.prorratearImportePorTramo(
        detallePedido.subtotalProd,
        cantidadYaConfirmada,
        cantidadRecibida,
        cantidadPedido,
      );

      detalle.dctoCompraProd = this.prorratearImportePorTramo(
        detallePedido.dctoCompraProd,
        cantidadYaConfirmada,
        cantidadRecibida,
        cantidadPedido,
      );

      detalle.ivaProd = this.prorratearImportePorTramo(
        detallePedido.ivaProd,
        cantidadYaConfirmada,
        cantidadRecibida,
        cantidadPedido,
      );

      detalle.totalProd = this.prorratearImportePorTramo(
        detallePedido.totalProd,
        cantidadYaConfirmada,
        cantidadRecibida,
        cantidadPedido,
      );

      detalle.dctoCaducProd = this.prorratearImportePorTramo(
        detallePedido.dctoCaducProd,
        cantidadYaConfirmada,
        cantidadRecibida,
        cantidadPedido,
      );
    }
  }

  private prorratearImportePorTramo(
    importeTotal: string | number | null | undefined,
    cantidadAnterior: number,
    cantidadNueva: number,
    cantidadTotal: number,
  ): number {
    if (cantidadNueva <= 0 || cantidadTotal <= 0) {
      return 0;
    }

    const importe = MoneyUtil.toNumber(importeTotal);

    const limiteAnterior = Math.min(
      Math.max(cantidadAnterior, 0),
      cantidadTotal,
    );

    const limitePosterior = Math.min(
      limiteAnterior + cantidadNueva,
      cantidadTotal,
    );

    /**
     * Calculamos importes acumulados y luego obtenemos
     * la diferencia del tramo.
     *
     * Ejemplo:
     * total = 10.00, cantidad = 3
     *
     * primera unidad  → 3.33
     * segunda unidad  → 3.34
     * tercera unidad  → 3.33
     *
     * suma final      → 10.00
     */
    const acumuladoAnterior = MoneyUtil.round(
      (importe * limiteAnterior) / cantidadTotal,
    );

    const acumuladoPosterior = MoneyUtil.round(
      (importe * limitePosterior) / cantidadTotal,
    );

    return MoneyUtil.subtract(acumuladoPosterior, acumuladoAnterior);
  }

  private async sincronizarDetallesEntregaCalculados(
    entidades: DetalleEntregaEntity[],
    detallesValidados: Array<CreateEntregaDetalleDTO | UpdateEntregaDetalleDTO>,
    manager: EntityManager,
  ): Promise<void> {
    const detallesPorId = new Map<
      number,
      CreateEntregaDetalleDTO | UpdateEntregaDetalleDTO
    >();

    for (const detalle of detallesValidados) {
      const ideDetaEntr = IdUtil.requireId(
        detalle.ideDetaEntr,
        'El ID del detalle de entrega no es válido.',
      );

      detallesPorId.set(ideDetaEntr, detalle);
    }

    for (const entidad of entidades) {
      const detalleCalculado = detallesPorId.get(entidad.ideDetaEntr);

      if (!detalleCalculado) {
        throw new BadRequestException(
          `No se pudo calcular el detalle de entrega ${entidad.ideDetaEntr}.`,
        );
      }

      entidad.estadoDetaEntr = detalleCalculado.estadoDetaEntr;

      entidad.precioUnitarioProd = MoneyUtil.toMoneyString(
        detalleCalculado.precioUnitarioProd,
      );

      entidad.subtotalProd = MoneyUtil.toMoneyString(
        detalleCalculado.subtotalProd,
      );

      entidad.dctoCompraProd = MoneyUtil.toMoneyString(
        detalleCalculado.dctoCompraProd,
      );

      entidad.ivaProd = MoneyUtil.toMoneyString(detalleCalculado.ivaProd);

      entidad.totalProd = MoneyUtil.toMoneyString(detalleCalculado.totalProd);

      entidad.dctoCaducProd = MoneyUtil.toMoneyString(
        detalleCalculado.dctoCaducProd,
      );
    }

    await this.entregasRepository.guardarDetallesEntrega(entidades, manager);
  }

  private determinarEstadoConfirmadoEntrega(
    detalles: Array<CreateEntregaDetalleDTO | UpdateEntregaDetalleDTO>,
    pedido: PedidoEntity,
  ): EnumEstadoEntrega {
    const detallesConRecepcion = detalles.filter(
      (detalle) =>
        detalle.estadoDetaEntr !== EnumEstadoDetalleEntrega.NO_ENTREGADO &&
        Number(detalle.cantidadProd) > 0,
    );

    if (!detallesConRecepcion.length) {
      throw new BadRequestException(
        'La entrega no contiene productos recibidos para confirmar.',
      );
    }

    const estadosActuales = new Map<number, EnumEstadoDetalleEntrega>();

    for (const detalle of detalles) {
      const ideDetaPedi = IdUtil.requireId(
        detalle.ideDetaPedi,
        'El detalle de pedido de la entrega no es válido.',
      );

      estadosActuales.set(ideDetaPedi, detalle.estadoDetaEntr);
    }

    const detallesPedidoActivos = (pedido.detalles ?? []).filter(
      (detallePedido) =>
        detallePedido.estadoDetaPedi !== 'cancelado' &&
        detallePedido.estadoDetaPedi !== 'cerrado_incompleto',
    );

    const todosCompletos =
      detallesPedidoActivos.length > 0 &&
      detallesPedidoActivos.every(
        (detallePedido) =>
          detallePedido.estadoDetaPedi === 'completo' ||
          estadosActuales.get(detallePedido.ideDetaPedi) ===
            EnumEstadoDetalleEntrega.COMPLETO,
      );

    return todosCompletos
      ? EnumEstadoEntrega.COMPLETA
      : EnumEstadoEntrega.PARCIAL;
  }
  private mapearEntidadesDetalleParaValidacion(
    detalles: DetalleEntregaEntity[],
  ): CreateEntregaDetalleDTO[] {
    return detalles.map((detalle) => ({
      ideDetaEntr: detalle.ideDetaEntr,
      ideEntr: detalle.ideEntr,
      ideDetaPedi: detalle.ideDetaPedi ?? undefined,
      ideProd: detalle.ideProd,
      cantidadProd: detalle.cantidadProd,
      precioUnitarioProd: Number(detalle.precioUnitarioProd),
      subtotalProd: Number(detalle.subtotalProd),
      dctoCompraProd: Number(detalle.dctoCompraProd),
      ivaProd: Number(detalle.ivaProd),
      totalProd: Number(detalle.totalProd),
      dctoCaducProd: Number(detalle.dctoCaducProd),
      estadoDetaEntr: detalle.estadoDetaEntr as EnumEstadoDetalleEntrega,
      lotesRecibidos: (detalle.lotesRecibidos ?? []).map((detalleLote) => ({
        ideDetaEntrLote: detalleLote.ideDetaEntrLote,
        ideDetaEntr: detalleLote.ideDetaEntr,
        ideLote: detalleLote.ideLote ?? undefined,
        fechaCaducidadLote: this.toDateOnly(detalleLote.fechaCaducidadLote),
        cantidadLote: detalleLote.cantidadLote,
        estadoDetaEntrLote:
          detalleLote.estadoDetaEntrLote as EnumEstadoDetalleEntregaLote,
      })),
    }));
  }

  private construirObservacionAnulacion(
    observacionActual: string | null | undefined,
    motivoAnulacion: string,
  ): string {
    const nuevaObservacion = `ANULACIÓN: ${motivoAnulacion.trim()}`;

    if (!observacionActual?.trim()) {
      return nuevaObservacion.slice(0, 250);
    }

    return `${observacionActual.trim()} | ${nuevaObservacion}`.slice(0, 250);
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
