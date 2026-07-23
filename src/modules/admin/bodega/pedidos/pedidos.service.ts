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
import { DetallePedidoEntity, EmpresaPreciosEntity } from '@entities';
import { EnumEstadoDetallePedido } from '@models';
import { DataSource, EntityManager } from 'typeorm';
import { CancelarPedidoDTO } from './dto/cancelar_pedido.dto';
import { CerrarPedidoIncompletoDTO } from './dto/cerrar_pedido_incompleto.dto';
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

interface ValoresEconomicosDetallePedido {
  precioUnitarioProd: number;
  subtotalProd: number;
  dctoCompraProd: number;
  ivaProd: number;
  totalProd: number;
  dctoCaducProd: number;
}

@Injectable()
export class PedidosService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly pedidosRepository: PedidosRepository,
  ) {}

  // ==========================================================
  // CONSULTAS
  // ==========================================================

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
    const idePedi = IdUtil.requireId(id, 'El ID del pedido no es válido.');

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

  // ==========================================================
  // CREAR BORRADOR
  // ==========================================================

  async insertar(body: CreatePedidoDTO) {
    this.validarFechaEsperada(body.cabeceraPedido.fechaEntrPedi, new Date());

    for (const detalle of body.detallePedido) {
      detalle.estadoDetaPedi = EnumEstadoDetallePedido.PENDIENTE;
    }

    this.validarDetallePedido(body.detallePedido);

    try {
      const pedido = await this.dataSource.transaction(async (manager) => {
        await this.validarEmpresaActiva(body.cabeceraPedido.ideEmpr, manager);

        /**
         * Sustituimos cualquier valor económico enviado
         * por el cliente por los valores oficiales.
         */
        await this.aplicarPreciosEmpresaADetalles(
          body.cabeceraPedido.ideEmpr,
          body.cabeceraPedido.motivoPedi,
          body.detallePedido,
          manager,
        );

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
        'Pedido guardado como borrador correctamente.',
        pedido.idePedi,
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo guardar el pedido.',
      );
    }
  }

  // ==========================================================
  // ACTUALIZAR BORRADOR
  // ==========================================================

  async actualizar(body: UpdatePedidoDTO) {
    const idePedi = IdUtil.requireId(
      body.cabeceraPedido.idePedi,
      'El ID del pedido no es válido.',
    );

    for (const detalle of body.detallePedido) {
      detalle.estadoDetaPedi = EnumEstadoDetallePedido.PENDIENTE;
    }

    this.validarDetallePedido(body.detallePedido);

    try {
      const pedido = await this.dataSource.transaction(async (manager) => {
        const pedidoActual = await this.pedidosRepository.buscarPorIdForUpdate(
          idePedi,
          manager,
        );

        if (!pedidoActual) {
          throw new NotFoundException('No se encontró el pedido indicado.');
        }

        if (pedidoActual.estadoPedi !== 'borrador') {
          throw new BadRequestException(
            `El pedido no puede modificarse porque se encuentra en estado "${pedidoActual.estadoPedi}".`,
          );
        }

        this.validarFechaEsperada(
          body.cabeceraPedido.fechaEntrPedi,
          pedidoActual.fechaPedi,
        );

        const entregasExistentes =
          await this.pedidosRepository.contarEntregasNoAnuladas(
            idePedi,
            manager,
          );

        if (entregasExistentes > 0) {
          throw new BadRequestException(
            'El pedido no puede modificarse porque ya tiene entregas relacionadas.',
          );
        }

        await this.validarEmpresaActiva(body.cabeceraPedido.ideEmpr, manager);

        /**
         * El borrador actualizado también se recalcula
         * desde empresa_precios.
         */
        await this.aplicarPreciosEmpresaADetalles(
          body.cabeceraPedido.ideEmpr,
          body.cabeceraPedido.motivoPedi,
          body.detallePedido,
          manager,
        );

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
        'Borrador de pedido actualizado correctamente.',
        pedido.idePedi,
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo actualizar el pedido.',
      );
    }
  }

  // ==========================================================
  // EMITIR PEDIDO
  // ==========================================================

  async emitir(id: number) {
    const idePedi = IdUtil.requireId(id, 'El ID del pedido no es válido.');

    try {
      const pedidoEmitido = await this.dataSource.transaction(
        async (manager) => {
          const pedidoBloqueado =
            await this.pedidosRepository.buscarPorIdForUpdate(idePedi, manager);

          if (!pedidoBloqueado) {
            throw new NotFoundException('No se encontró el pedido indicado.');
          }

          if (pedidoBloqueado.estadoPedi !== 'borrador') {
            throw new BadRequestException(
              `El pedido no puede emitirse porque se encuentra en estado "${pedidoBloqueado.estadoPedi}".`,
            );
          }

          const pedido = await this.pedidosRepository.buscarPorId(
            idePedi,
            manager,
          );

          if (!pedido) {
            throw new NotFoundException(
              'No se pudo obtener la información completa del pedido.',
            );
          }

          await this.validarEmpresaActiva(pedido.ideEmpr, manager);

          if (!pedidoBloqueado.fechaEntrPedi) {
            throw new BadRequestException(
              'El pedido no puede emitirse sin una fecha esperada de entrega.',
            );
          }

          const detalles = await this.pedidosRepository.listarDetallesPorPedido(
            idePedi,
            manager,
          );

          this.validarDetallesPersistidos(detalles);

          const entregasExistentes =
            await this.pedidosRepository.contarEntregasNoAnuladas(
              idePedi,
              manager,
            );

          if (entregasExistentes > 0) {
            throw new BadRequestException(
              'El pedido no puede emitirse porque ya tiene entregas relacionadas.',
            );
          }

          const productosInactivos = detalles.filter(
            (detalle) =>
              !detalle.producto || detalle.producto.estadoProd !== 'activo',
          );

          if (productosInactivos.length > 0) {
            const nombres = productosInactivos
              .map(
                (detalle) =>
                  detalle.producto?.nombreProd ?? `Producto ${detalle.ideProd}`,
              )
              .join(', ');

            throw new BadRequestException(
              `El pedido contiene productos inexistentes o inactivos: ${nombres}.`,
            );
          }

          /**
           * Antes de emitir, volvemos a consultar los precios
           * vigentes de la empresa.
           *
           * Esto garantiza que un borrador antiguo no sea
           * emitido con precios desactualizados o manipulados.
           */
          const totales = await this.recalcularDetallesPersistidosDesdeEmpresa(
            pedido.ideEmpr,
            pedido.motivoPedi,
            detalles,
            manager,
          );

          pedidoBloqueado.cantidadTotalPedi = totales.cantidadTotalPedi;

          pedidoBloqueado.totalPedi = MoneyUtil.toMoneyString(
            totales.totalPedi,
          );

          pedidoBloqueado.estadoPedi = 'emitido';
          pedidoBloqueado.usuaActua = 'admin';
          pedidoBloqueado.fechaActua = new Date();

          return this.pedidosRepository.guardarPedido(pedidoBloqueado, manager);
        },
      );

      return ApiResponseFactory.legacyWrite(
        1,
        'Pedido emitido correctamente.',
        pedidoEmitido.idePedi,
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo emitir el pedido.',
      );
    }
  }

  // ==========================================================
  // CANCELAR PEDIDO
  // ==========================================================

  async cancelar(id: number, body: CancelarPedidoDTO) {
    const idePedi = IdUtil.requireId(id, 'El ID del pedido no es válido.');

    try {
      const pedidoCancelado = await this.dataSource.transaction(
        async (manager) => {
          const pedido = await this.pedidosRepository.buscarPorIdForUpdate(
            idePedi,
            manager,
          );

          if (!pedido) {
            throw new NotFoundException('No se encontró el pedido indicado.');
          }

          if (
            pedido.estadoPedi !== 'borrador' &&
            pedido.estadoPedi !== 'emitido'
          ) {
            throw new BadRequestException(
              `El pedido no puede cancelarse porque se encuentra en estado "${pedido.estadoPedi}".`,
            );
          }

          const entregasExistentes =
            await this.pedidosRepository.contarEntregasNoAnuladas(
              idePedi,
              manager,
            );

          if (entregasExistentes > 0) {
            throw new BadRequestException(
              'El pedido no puede cancelarse porque tiene entregas activas relacionadas.',
            );
          }

          const detalles = await this.pedidosRepository.listarDetallesPorPedido(
            idePedi,
            manager,
          );

          for (const detalle of detalles) {
            detalle.estadoDetaPedi = 'cancelado';
          }

          await this.pedidosRepository.guardarDetallesPedido(detalles, manager);

          pedido.estadoPedi = 'cancelado';
          pedido.observacionPedi = this.construirObservacionEstado(
            pedido.observacionPedi,
            'CANCELACIÓN',
            body.motivoCancelacion,
          );
          pedido.usuaActua = 'admin';
          pedido.fechaActua = new Date();

          return this.pedidosRepository.guardarPedido(pedido, manager);
        },
      );

      return ApiResponseFactory.legacyWrite(
        1,
        'Pedido cancelado correctamente.',
        pedidoCancelado.idePedi,
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo cancelar el pedido.',
      );
    }
  }

  // ==========================================================
  // CERRAR PEDIDO INCOMPLETO
  // ==========================================================

  async cerrarIncompleto(id: number, body: CerrarPedidoIncompletoDTO) {
    const idePedi = IdUtil.requireId(id, 'El ID del pedido no es válido.');

    try {
      const pedidoCerrado = await this.dataSource.transaction(
        async (manager) => {
          const pedido = await this.pedidosRepository.buscarPorIdForUpdate(
            idePedi,
            manager,
          );

          if (!pedido) {
            throw new NotFoundException('No se encontró el pedido indicado.');
          }

          if (pedido.estadoPedi !== 'parcial') {
            throw new BadRequestException(
              `Solo puede cerrarse incompleto un pedido parcial. Estado actual: "${pedido.estadoPedi}".`,
            );
          }

          const borradoresPendientes =
            await this.pedidosRepository.contarEntregasBorrador(
              idePedi,
              manager,
            );

          if (borradoresPendientes > 0) {
            throw new BadRequestException(
              'El pedido tiene entregas en borrador. Debe confirmarlas o eliminarlas antes de cerrar el pedido.',
            );
          }

          const entregasConfirmadas =
            await this.pedidosRepository.contarEntregasConfirmadas(
              idePedi,
              manager,
            );

          if (entregasConfirmadas === 0) {
            throw new BadRequestException(
              'El pedido no tiene entregas confirmadas que justifiquen un cierre incompleto.',
            );
          }

          const detalles = await this.pedidosRepository.listarDetallesPorPedido(
            idePedi,
            manager,
          );

          const detallesPendientes = detalles.filter(
            (detalle) =>
              detalle.estadoDetaPedi === 'pendiente' ||
              detalle.estadoDetaPedi === 'parcial',
          );

          if (detallesPendientes.length === 0) {
            throw new BadRequestException(
              'El pedido no contiene detalles pendientes o parcialmente entregados.',
            );
          }

          for (const detalle of detallesPendientes) {
            detalle.estadoDetaPedi = 'cerrado_incompleto';
          }

          await this.pedidosRepository.guardarDetallesPedido(detalles, manager);

          pedido.estadoPedi = 'cerrado_incompleto';
          pedido.observacionPedi = this.construirObservacionEstado(
            pedido.observacionPedi,
            'CIERRE INCOMPLETO',
            body.motivoCierre,
          );
          pedido.usuaActua = 'admin';
          pedido.fechaActua = new Date();

          return this.pedidosRepository.guardarPedido(pedido, manager);
        },
      );

      return ApiResponseFactory.legacyWrite(
        1,
        'Pedido cerrado como incompleto correctamente.',
        pedidoCerrado.idePedi,
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo cerrar el pedido.',
      );
    }
  }

  // ==========================================================
  // ELIMINAR BORRADOR
  // ==========================================================

  async eliminar(id: number) {
    const idePedi = IdUtil.requireId(id, 'El ID del pedido no es válido.');

    try {
      const affected = await this.dataSource.transaction(async (manager) => {
        const pedido = await this.pedidosRepository.buscarPorIdForUpdate(
          idePedi,
          manager,
        );

        if (!pedido) {
          return 0;
        }

        if (pedido.estadoPedi !== 'borrador') {
          throw new BadRequestException(
            `El pedido no puede eliminarse porque se encuentra en estado "${pedido.estadoPedi}".`,
          );
        }

        const entregasExistentes =
          await this.pedidosRepository.contarEntregasNoAnuladas(
            idePedi,
            manager,
          );

        if (entregasExistentes > 0) {
          throw new BadRequestException(
            'El pedido no puede eliminarse porque tiene entregas relacionadas.',
          );
        }

        return this.pedidosRepository.eliminarPedidoConDetalles(
          idePedi,
          manager,
        );
      });

      if (affected === 0) {
        return ApiResponseFactory.legacyWrite(
          0,
          'No se encontró el pedido indicado.',
        );
      }

      return ApiResponseFactory.legacyWrite(
        1,
        'Borrador de pedido eliminado correctamente.',
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo eliminar el pedido.',
      );
    }
  }

  // ==========================================================
  // JOINS
  // ==========================================================

  async listarPedidos() {
    return this.listar();
  }

  async filtrarPedidos(queryParams: FilterPedidoDTO) {
    return this.filtrar(queryParams);
  }

  async listarDetallesPedido(idPedido: number) {
    const idePedi = IdUtil.requireId(
      idPedido,
      'El ID del pedido no es válido.',
    );

    const detalles = await this.dataSource.transaction((manager) =>
      this.pedidosRepository.listarDetallesPorPedido(idePedi, manager),
    );

    return ApiResponseFactory.legacyRead(
      PedidosMapper.toDetalleRows(detalles),
      'Filtrado de detalles de pedido completado',
    );
  }

  // ==========================================================
  // COMBOS
  // ==========================================================

  async listarComboEstados() {
    return ComboMapper.fromValues([
      'borrador',
      'emitido',
      'parcial',
      'completado',
      'cerrado_incompleto',
      'cancelado',
    ]);
  }

  async listarComboMotivos() {
    return ComboMapper.fromValues(['peticion', 'devolucion']);
  }

  async listarComboPedidos() {
    const pedidos = await this.dataSource.transaction((manager) =>
      this.pedidosRepository.listar(manager),
    );

    /**
     * Para registrar entregas solo deben
     * mostrarse pedidos abiertos.
     */
    const pedidosAbiertos = pedidos.filter(
      (pedido) =>
        pedido.estadoPedi === 'emitido' || pedido.estadoPedi === 'parcial',
    );

    return ComboMapper.fromEntities(
      pedidosAbiertos,
      (pedido) =>
        `Pedido #${pedido.idePedi} - ${
          pedido.empresa?.nombreEmpr ?? 'Empresa'
        }`,
      (pedido) => pedido.idePedi,
    );
  }

  // ==========================================================
  // VALIDACIONES PRIVADAS
  // ==========================================================

  private async validarEmpresaActiva(
    ideEmprRaw: number,
    manager: EntityManager,
  ): Promise<void> {
    const ideEmpr = IdUtil.requireId(
      ideEmprRaw,
      'El ID de la empresa no es válido.',
    );

    const empresa = await this.pedidosRepository.buscarEmpresaPorId(
      ideEmpr,
      manager,
    );

    if (!empresa) {
      throw new BadRequestException('La empresa seleccionada no existe.');
    }

    if (empresa.estadoEmpr !== 'activo') {
      throw new BadRequestException(
        'La empresa seleccionada se encuentra inactiva.',
      );
    }
  }

  private validarFechaEsperada(
    fechaEsperada: string,
    fechaPedido: Date,
  ): void {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fechaEsperada);

    if (!match) {
      throw new BadRequestException(
        'La fecha esperada de entrega debe tener formato YYYY-MM-DD.',
      );
    }

    const [, yearText, monthText, dayText] = match;
    const year = Number(yearText);
    const month = Number(monthText);
    const day = Number(dayText);
    const parsed = new Date(year, month - 1, day);

    if (
      parsed.getFullYear() !== year ||
      parsed.getMonth() !== month - 1 ||
      parsed.getDate() !== day
    ) {
      throw new BadRequestException(
        'La fecha esperada de entrega no es válida.',
      );
    }

    const expectedKey = year * 10000 + month * 100 + day;
    const orderKey =
      fechaPedido.getFullYear() * 10000 +
      (fechaPedido.getMonth() + 1) * 100 +
      fechaPedido.getDate();

    if (expectedKey < orderKey) {
      throw new BadRequestException(
        'La fecha esperada de entrega no puede ser anterior a la fecha del pedido.',
      );
    }
  }

  private validarDetallePedido(detalles: CreatePedidoDetalleDTO[]): void {
    if (!Array.isArray(detalles) || detalles.length === 0) {
      throw new BadRequestException(
        'Debe agregar al menos un producto al pedido.',
      );
    }

    const productosAgregados = new Set<number>();

    for (const detalle of detalles) {
      const ideProd = IdUtil.parseId(detalle.ideProd);

      if (ideProd === null) {
        throw new BadRequestException(
          'Todos los detalles deben tener un producto válido.',
        );
      }

      if (productosAgregados.has(ideProd)) {
        throw new BadRequestException(
          'Un mismo producto no puede repetirse en el detalle del pedido.',
        );
      }

      productosAgregados.add(ideProd);

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

      /**
       * Los importes enviados por el cliente no se
       * consideran autoridad.
       *
       * El backend los reemplaza desde empresa_precios
       * dentro de la misma transacción.
       */
    }
  }

  private validarDetallesPersistidos(detalles: DetallePedidoEntity[]): void {
    if (!Array.isArray(detalles) || detalles.length === 0) {
      throw new BadRequestException(
        'El pedido no tiene productos registrados.',
      );
    }

    const productosAgregados = new Set<number>();

    for (const detalle of detalles) {
      if (!Number.isInteger(detalle.ideProd) || detalle.ideProd <= 0) {
        throw new BadRequestException(
          'El pedido contiene un producto inválido.',
        );
      }

      if (productosAgregados.has(detalle.ideProd)) {
        throw new BadRequestException(
          'El pedido contiene productos repetidos.',
        );
      }

      productosAgregados.add(detalle.ideProd);

      if (
        !Number.isInteger(detalle.cantidadProd) ||
        detalle.cantidadProd <= 0
      ) {
        throw new BadRequestException(
          'El pedido contiene cantidades inválidas.',
        );
      }
    }
  }

  private async aplicarPreciosEmpresaADetalles(
    ideEmpr: number,
    motivoPedi: 'peticion' | 'devolucion',
    detalles: CreatePedidoDetalleDTO[],
    manager: EntityManager,
  ): Promise<void> {
    const preciosPorProducto = await this.obtenerPreciosEmpresaPorProducto(
      ideEmpr,
      detalles.map((detalle) => detalle.ideProd),
      manager,
    );

    for (const detalle of detalles) {
      const precioEmpresa = preciosPorProducto.get(detalle.ideProd);

      if (!precioEmpresa) {
        throw new BadRequestException(
          `El producto ${detalle.ideProd} no tiene un precio configurado para la empresa seleccionada.`,
        );
      }

      const valores = this.calcularValoresEconomicosDetalle(
        precioEmpresa,
        detalle.cantidadProd,
        motivoPedi,
      );

      detalle.precioUnitarioProd = valores.precioUnitarioProd;

      detalle.subtotalProd = valores.subtotalProd;

      detalle.dctoCompraProd = valores.dctoCompraProd;

      detalle.ivaProd = valores.ivaProd;

      detalle.totalProd = valores.totalProd;

      detalle.dctoCaducProd = valores.dctoCaducProd;

      detalle.estadoDetaPedi = EnumEstadoDetallePedido.PENDIENTE;
    }
  }

  private async recalcularDetallesPersistidosDesdeEmpresa(
    ideEmpr: number,
    motivoPedi: 'peticion' | 'devolucion',
    detalles: DetallePedidoEntity[],
    manager: EntityManager,
  ): Promise<TotalesPedidoCalculados> {
    const preciosPorProducto = await this.obtenerPreciosEmpresaPorProducto(
      ideEmpr,
      detalles.map((detalle) => detalle.ideProd),
      manager,
    );

    const totales: TotalesPedidoCalculados = {
      cantidadTotalPedi: 0,
      totalPedi: 0,
    };

    for (const detalle of detalles) {
      const precioEmpresa = preciosPorProducto.get(detalle.ideProd);

      if (!precioEmpresa) {
        throw new BadRequestException(
          `El producto ${detalle.ideProd} no tiene un precio configurado para la empresa seleccionada.`,
        );
      }

      const valores = this.calcularValoresEconomicosDetalle(
        precioEmpresa,
        detalle.cantidadProd,
        motivoPedi,
      );

      detalle.precioUnitarioProd = MoneyUtil.toMoneyString(
        valores.precioUnitarioProd,
      );

      detalle.subtotalProd = MoneyUtil.toMoneyString(valores.subtotalProd);

      detalle.dctoCompraProd = MoneyUtil.toMoneyString(valores.dctoCompraProd);

      detalle.ivaProd = MoneyUtil.toMoneyString(valores.ivaProd);

      detalle.totalProd = MoneyUtil.toMoneyString(valores.totalProd);

      detalle.dctoCaducProd = MoneyUtil.toMoneyString(valores.dctoCaducProd);

      detalle.estadoDetaPedi = EnumEstadoDetallePedido.PENDIENTE;

      totales.cantidadTotalPedi += detalle.cantidadProd;

      totales.totalPedi = MoneyUtil.add(totales.totalPedi, valores.totalProd);
    }

    await this.pedidosRepository.guardarDetallesPedido(detalles, manager);

    return totales;
  }

  private async obtenerPreciosEmpresaPorProducto(
    ideEmpr: number,
    idsProductos: number[],
    manager: EntityManager,
  ): Promise<Map<number, EmpresaPreciosEntity>> {
    const idsUnicos = Array.from(new Set(idsProductos));

    const precios =
      await this.pedidosRepository.listarPreciosPorEmpresaYProductos(
        ideEmpr,
        idsUnicos,
        manager,
      );

    const preciosPorProducto = new Map<number, EmpresaPreciosEntity>();

    for (const precio of precios) {
      /**
       * Defensa temporal hasta agregar la restricción
       * UNIQUE de empresa + producto en PostgreSQL.
       */
      if (preciosPorProducto.has(precio.ideProd)) {
        throw new BadRequestException(
          `El producto ${precio.ideProd} tiene más de un precio configurado para la empresa ${ideEmpr}. Debe corregirse la configuración antes de continuar.`,
        );
      }

      if (!precio.producto) {
        throw new BadRequestException(
          `El producto ${precio.ideProd} asociado al precio de empresa no existe.`,
        );
      }

      if (precio.producto.estadoProd !== 'activo') {
        throw new BadRequestException(
          `El producto "${precio.producto.nombreProd}" se encuentra inactivo.`,
        );
      }

      preciosPorProducto.set(precio.ideProd, precio);
    }

    const idsSinPrecio = idsUnicos.filter(
      (ideProd) => !preciosPorProducto.has(ideProd),
    );

    if (idsSinPrecio.length > 0) {
      throw new BadRequestException(
        `Los siguientes productos no tienen precio registrado para la empresa seleccionada: ${idsSinPrecio.join(', ')}.`,
      );
    }

    return preciosPorProducto;
  }

  private calcularValoresEconomicosDetalle(
    precioEmpresa: EmpresaPreciosEntity,
    cantidad: number,
    motivoPedi: 'peticion' | 'devolucion',
  ): ValoresEconomicosDetallePedido {
    const precioUnitario = MoneyUtil.toNumber(precioEmpresa.precioCompraProd);

    /**
     * En la estructura actual, los descuentos de
     * empresa_precios representan valores monetarios
     * unitarios.
     */
    const descuentoCompraUnitario = MoneyUtil.toNumber(
      precioEmpresa.dctoCompraProd,
    );

    const descuentoCaducidadUnitario = MoneyUtil.toNumber(
      precioEmpresa.dctoCaducidadProd,
    );

    const tasaIva = MoneyUtil.normalizeRate(precioEmpresa.ivaProd);

    if (precioUnitario < 0) {
      throw new BadRequestException(
        `El precio configurado para el producto ${precioEmpresa.ideProd} no es válido.`,
      );
    }

    if (tasaIva < 0 || tasaIva > 1) {
      throw new BadRequestException(
        `El IVA configurado para el producto ${precioEmpresa.ideProd} no es válido.`,
      );
    }

    if (descuentoCompraUnitario < 0 || descuentoCaducidadUnitario < 0) {
      throw new BadRequestException(
        `Los descuentos configurados para el producto ${precioEmpresa.ideProd} no son válidos.`,
      );
    }

    const subtotalBruto = MoneyUtil.multiply(precioUnitario, cantidad);

    const descuentoCompra = MoneyUtil.multiply(
      descuentoCompraUnitario,
      cantidad,
    );

    const descuentoCaducidad =
      motivoPedi === 'devolucion'
        ? MoneyUtil.multiply(descuentoCaducidadUnitario, cantidad)
        : 0;

    const descuentoTotal = MoneyUtil.add(descuentoCompra, descuentoCaducidad);

    if (descuentoTotal > subtotalBruto) {
      throw new BadRequestException(
        `Los descuentos configurados para el producto ${precioEmpresa.ideProd} superan el subtotal de compra.`,
      );
    }

    const subtotal = MoneyUtil.subtract(subtotalBruto, descuentoTotal);

    const iva = MoneyUtil.round(subtotal * tasaIva);

    const total = MoneyUtil.add(subtotal, iva);

    return {
      precioUnitarioProd: precioUnitario,

      subtotalProd: subtotal,

      dctoCompraProd: descuentoCompra,

      ivaProd: iva,

      totalProd: total,

      dctoCaducProd: descuentoCaducidad,
    };
  }

  private calcularTotalesDesdeDetalle(
    detalles: CreatePedidoDetalleDTO[],
  ): TotalesPedidoCalculados {
    return detalles.reduce<TotalesPedidoCalculados>(
      (totales, detalle) => ({
        cantidadTotalPedi:
          totales.cantidadTotalPedi + Number(detalle.cantidadProd),

        totalPedi: MoneyUtil.add(totales.totalPedi, detalle.totalProd),
      }),
      {
        cantidadTotalPedi: 0,
        totalPedi: 0,
      },
    );
  }

  private construirObservacionEstado(
    observacionActual: string | null | undefined,
    titulo: string,
    motivo: string,
  ): string {
    const nuevaObservacion = `${titulo}: ${motivo.trim()}`;

    if (!observacionActual?.trim()) {
      return nuevaObservacion.slice(0, 250);
    }

    return `${observacionActual.trim()} | ${nuevaObservacion}`.slice(0, 250);
  }
}
