import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { IdUtil } from '@common/index';
import { LoteEntity, ProductoEntity } from '@entities';
import { EnumTipoMovimientoInventario } from '@models';
import { DataSource, EntityManager } from 'typeorm';
import { ConfirmarVentaPosDto } from './dto/confirmar_venta_pos.dto';
import { ItemVentaPosDto } from './dto/item_venta_pos.dto';
import {
  PosCalculatorService,
  PosDetalleCalculado,
} from './domain/pos-calculator.service';
import { InvoiceNumberService } from './domain/invoice-number.service';
import {
  PosAlertaStock,
  StockPolicyService,
} from './domain/stock-policy.service';
import { PosRepository } from './pos.repository';

type TipoPagoVenta =
  | 'efectivo'
  | 'tarjeta_credito'
  | 'tarjeta_debito'
  | 'paypal';

interface AsignacionLoteVenta {
  lote: LoteEntity;
  cantidad: number;
}

export interface LoteConsumidoVenta {
  ideLote: number;
  fechaCaducidadLote: string;
  cantidad: number;
}

@Injectable()
export class PosService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly posRepository: PosRepository,
    private readonly posCalculatorService: PosCalculatorService,
    private readonly invoiceNumberService: InvoiceNumberService,
    private readonly stockPolicyService: StockPolicyService,
  ) {}

  async buscarProductoPorCodigo(codigo: string) {
    const producto = await this.dataSource.transaction(async (manager) => {
      return this.posRepository.findProductoActivoByCodigo(codigo, manager);
    });

    if (!producto) {
      throw new NotFoundException(
        'No se encontró un producto activo con ese código.',
      );
    }

    return {
      data: producto,
      response: {
        success: true,
        message: 'Producto encontrado correctamente.',
      },
    };
  }

  async buscarClientePorCedula(cedula: string) {
    const cliente = await this.dataSource.transaction(async (manager) => {
      return this.posRepository.findClienteByCedula(cedula, manager);
    });

    if (!cliente) {
      throw new NotFoundException(
        'No se encontró un cliente registrado con esa cédula.',
      );
    }

    return {
      data: cliente,
      response: {
        success: true,
        message: 'Cliente encontrado correctamente.',
      },
    };
  }

  async confirmarVenta(dto: ConfirmarVentaPosDto, user: any) {
    this.validarItemsVenta(dto.items);

    const ideClie = IdUtil.requireId(
      dto.ideClie,
      'El ID del cliente no es válido.',
    );

    const ideEmplRaw = user?.ideEmpl ?? dto.ideEmpl;

    const ideEmpl = IdUtil.requireId(
      ideEmplRaw,
      'No se pudo identificar el cajero de la venta.',
    );

    const ideMetoPago =
      dto.ideMetoPago === null || dto.ideMetoPago === undefined
        ? null
        : IdUtil.requireId(
            dto.ideMetoPago,
            'El ID del método de pago no es válido.',
          );

    return this.dataSource.transaction(async (manager) => {
      /**
       * Ordenar por producto mantiene un orden de bloqueo estable y reduce
       * el riesgo de interbloqueos cuando existen ventas simultáneas.
       */
      const itemsConsolidados = this.posCalculatorService
        .consolidarItems(dto.items)
        .sort((a, b) => Number(a.ideProd) - Number(b.ideProd));

      const numeroFactura = this.invoiceNumberService.generarNumeroFactura();

      const cliente = await this.posRepository.findClienteById(
        ideClie,
        manager,
      );

      if (!cliente) {
        throw new BadRequestException(
          'El cliente seleccionado no existe en el sistema.',
        );
      }

      const pagoValidado = await this.resolverMetodoPagoVenta(
        dto.tipoPagoVent,
        ideMetoPago,
        ideClie,
        manager,
      );

      const detallesCalculados: PosDetalleCalculado[] = [];
      const alertasStock: PosAlertaStock[] = [];
      const productosBloqueados = new Map<number, ProductoEntity>();
      const lotesPorProducto = new Map<number, AsignacionLoteVenta[]>();

      for (const item of itemsConsolidados) {
        const ideProd = IdUtil.requireId(
          item.ideProd,
          'El ID del producto no es válido.',
        );

        const producto =
          await this.posRepository.findProductoActivoByIdForUpdate(
            ideProd,
            manager,
          );

        if (!producto) {
          throw new BadRequestException(
            `El producto con ID ${ideProd} no existe o no está activo.`,
          );
        }

        this.stockPolicyService.validarStockDisponible(producto, item.cantidad);

        const lotes = await this.posRepository.findLotesVendiblesFefoForUpdate(
          ideProd,
          manager,
        );

        const stockVendible = lotes.reduce(
          (total, lote) => total + Number(lote.stockLote),
          0,
        );

        if (stockVendible < item.cantidad) {
          throw new BadRequestException(
            `Stock vendible insuficiente para "${producto.nombreProd}". ` +
              `Disponible en lotes vigentes: ${stockVendible}, solicitado: ${item.cantidad}.`,
          );
        }

        lotesPorProducto.set(
          ideProd,
          this.asignarLotesFefo(lotes, item.cantidad),
        );

        const detalleCalculado = this.posCalculatorService.calcularDetalle(
          producto,
          item.cantidad,
        );

        detallesCalculados.push(detalleCalculado);
        productosBloqueados.set(producto.ideProd, producto);
      }

      const totalesVenta =
        this.posCalculatorService.calcularTotales(detallesCalculados);

      const venta = await this.posRepository.guardarVenta(
        {
          ideClie,
          ideEmpl,
          numFacturaVent: numeroFactura,
          fechaVent: new Date(),
          cantidadVent: totalesVenta.cantidadTotal,
          subTotalVent: totalesVenta.subtotalVenta.toFixed(2),
          totalVent: totalesVenta.totalVenta.toFixed(2),
          dctoSocioVent: '0.00',
          dctoEdadVent: '0.00',
          estadoVent: 'completado',
          tipoPagoVent: pagoValidado.tipoPagoVent,
          ideMetoPago: pagoValidado.ideMetoPago,
          usuaIngre: 'pos',
        },
        manager,
      );

      const lotesConsumidosPorProducto = new Map<
        number,
        LoteConsumidoVenta[]
      >();

      for (const detalle of detallesCalculados) {
        const detalleGuardado = await this.posRepository.guardarDetalleVenta(
          {
            ideVent: venta.ideVent,
            ideProd: detalle.ideProd,
            cantidadProd: detalle.cantidad,
            precioUnitarioProd: detalle.precioUnitario.toFixed(2),
            subtotalProd: detalle.subtotal.toFixed(2),
            dctoPromoProd: detalle.descuento.toFixed(2),
            ivaProd: detalle.iva.toFixed(2),
            totalProd: detalle.total.toFixed(2),
          },
          manager,
        );

        const producto = productosBloqueados.get(detalle.ideProd);
        const asignaciones = lotesPorProducto.get(detalle.ideProd) ?? [];

        if (!producto || !asignaciones.length) {
          throw new BadRequestException(
            `No se pudo resolver el inventario FEFO del producto ${detalle.ideProd}.`,
          );
        }

        const lotesConsumidos: LoteConsumidoVenta[] = [];

        for (const asignacion of asignaciones) {
          const lote = asignacion.lote;
          const cantidad = asignacion.cantidad;
          const stockProdAnterior = Number(producto.stockProd);
          const stockLoteAnterior = Number(lote.stockLote);

          if (stockLoteAnterior < cantidad) {
            throw new BadRequestException(
              `El lote ${lote.ideLote} ya no tiene ${cantidad} unidades disponibles.`,
            );
          }

          lote.stockLote = stockLoteAnterior - cantidad;
          await this.posRepository.guardarLote(lote, manager);

          this.stockPolicyService.descontarStock(producto, cantidad, 'pos');
          await this.posRepository.guardarProducto(producto, manager);

          await this.posRepository.registrarMovimientoVenta(
            {
              ideProd: detalle.ideProd,
              ideLote: lote.ideLote,
              ideDetaVent: detalleGuardado.ideDetaVent,
              tipoMovi: EnumTipoMovimientoInventario.SALIDA_VENTA,
              cantidadMovi: -cantidad,
              stockProdAnterior,
              stockProdPosterior: Number(producto.stockProd),
              stockLoteAnterior,
              stockLotePosterior: Number(lote.stockLote),
              observacionMovi:
                `Venta POS ${venta.numFacturaVent}. ` +
                `Producto ${detalle.ideProd}, lote ${lote.ideLote}, ` +
                `caducidad ${this.fechaCalendario(lote.fechaCaducidadLote)}.`,
              usuaIngre: 'pos',
            },
            manager,
          );

          lotesConsumidos.push({
            ideLote: lote.ideLote,
            fechaCaducidadLote: this.fechaCalendario(
              lote.fechaCaducidadLote,
            ),
            cantidad,
          });
        }

        lotesConsumidosPorProducto.set(detalle.ideProd, lotesConsumidos);

        const alertaStock =
          this.stockPolicyService.crearAlertaSiStockBajo(producto);

        if (alertaStock) {
          alertasStock.push(alertaStock);
        }
      }

      return {
        data: {
          ideVent: venta.ideVent,
          numFacturaVent: venta.numFacturaVent,
          cantidadVent: totalesVenta.cantidadTotal,
          subtotalVent: totalesVenta.subtotalVenta,
          ivaVent: totalesVenta.ivaVenta,
          descuentoVent: totalesVenta.descuentoVenta,
          totalVent: totalesVenta.totalVenta,
          detalles: detallesCalculados.map((detalle) => ({
            ...detalle,
            lotesConsumidos:
              lotesConsumidosPorProducto.get(detalle.ideProd) ?? [],
          })),
          alertasStock,
        },
        response: {
          success: true,
          message: 'Venta POS registrada correctamente con inventario FEFO.',
        },
      };
    });
  }

  async cancelarVenta(ideVent: number) {
    const idVenta = IdUtil.requireId(
      ideVent,
      'El ID de la venta no es válido.',
    );

    return this.dataSource.transaction(async (manager) => {
      const venta = await this.posRepository.findVentaByIdForUpdate(
        idVenta,
        manager,
      );

      if (!venta) {
        throw new NotFoundException('No se encontró la venta indicada.');
      }

      if (venta.estadoVent === 'cancelado') {
        throw new BadRequestException('La venta ya se encuentra cancelada.');
      }

      if (venta.estadoVent === 'devuelto') {
        throw new BadRequestException(
          'La venta ya fue marcada como devuelta y no puede cancelarse.',
        );
      }

      const detalles = await this.posRepository.findDetallesByVenta(
        idVenta,
        manager,
      );

      if (!detalles.length) {
        throw new BadRequestException(
          'La venta no tiene detalles asociados para revertir stock.',
        );
      }

      const productosActualizados: Array<{
        ideProd: number;
        nombreProd: string;
        stockActual: number;
      }> = [];

      for (const detalle of detalles) {
        const ideProd = IdUtil.requireId(
          detalle.ideProd,
          'El ID del producto no es válido.',
        );

        const producto = await this.posRepository.findProductoByIdForUpdate(
          ideProd,
          manager,
        );

        if (!producto) {
          throw new BadRequestException(
            `No se encontró el producto ${ideProd} para revertir stock.`,
          );
        }

        const movimientos =
          await this.posRepository.findMovimientosSalidaVentaByDetalleForUpdate(
            detalle.ideDetaVent,
            manager,
          );

        if (!movimientos.length) {
          throw new BadRequestException(
            `La venta ${venta.numFacturaVent} no posee movimientos FEFO para el producto ${ideProd}.`,
          );
        }

        const cantidadMovida = movimientos.reduce(
          (total, movimiento) =>
            total + Math.abs(Number(movimiento.cantidadMovi)),
          0,
        );

        if (cantidadMovida !== Number(detalle.cantidadProd)) {
          throw new BadRequestException(
            `Los movimientos del producto ${ideProd} no coinciden con la cantidad vendida.`,
          );
        }

        for (const movimiento of movimientos) {
          const ideLote = Number(movimiento.ideLote);
          const cantidad = Math.abs(Number(movimiento.cantidadMovi));

          if (!Number.isInteger(ideLote) || ideLote <= 0 || cantidad <= 0) {
            throw new BadRequestException(
              `El movimiento ${movimiento.ideMovi} no contiene un lote válido.`,
            );
          }

          const lote = await this.posRepository.findLoteByIdForUpdate(
            ideLote,
            manager,
          );

          if (!lote || Number(lote.ideProd) !== ideProd) {
            throw new BadRequestException(
              `No se encontró el lote ${ideLote} del producto ${ideProd} para revertir la venta.`,
            );
          }

          const stockProdAnterior = Number(producto.stockProd);
          const stockLoteAnterior = Number(lote.stockLote);

          lote.stockLote = stockLoteAnterior + cantidad;
          await this.posRepository.guardarLote(lote, manager);

          this.stockPolicyService.revertirStock(producto, cantidad, 'pos');
          await this.posRepository.guardarProducto(producto, manager);

          await this.posRepository.registrarMovimientoVenta(
            {
              ideProd,
              ideLote,
              ideDetaVent: detalle.ideDetaVent,
              tipoMovi: EnumTipoMovimientoInventario.ANULACION_VENTA,
              cantidadMovi: cantidad,
              stockProdAnterior,
              stockProdPosterior: Number(producto.stockProd),
              stockLoteAnterior,
              stockLotePosterior: Number(lote.stockLote),
              observacionMovi:
                `Anulación de venta POS ${venta.numFacturaVent}. ` +
                `Producto ${ideProd}, lote ${ideLote}.`,
              usuaIngre: 'pos',
            },
            manager,
          );
        }

        productosActualizados.push({
          ideProd: producto.ideProd,
          nombreProd: producto.nombreProd,
          stockActual: producto.stockProd,
        });
      }

      venta.estadoVent = 'cancelado';
      venta.usuaActua = 'pos';
      venta.fechaActua = new Date();

      const ventaCancelada = await this.posRepository.guardarVenta(
        venta,
        manager,
      );

      return {
        data: {
          ideVent: ventaCancelada.ideVent,
          numFacturaVent: ventaCancelada.numFacturaVent,
          estadoVent: ventaCancelada.estadoVent,
          productosActualizados,
        },
        response: {
          success: true,
          message:
            'Venta cancelada correctamente; producto y lotes fueron revertidos.',
        },
      };
    });
  }

  private asignarLotesFefo(
    lotes: LoteEntity[],
    cantidadSolicitada: number,
  ): AsignacionLoteVenta[] {
    let pendiente = cantidadSolicitada;
    const asignaciones: AsignacionLoteVenta[] = [];

    for (const lote of lotes) {
      if (pendiente <= 0) {
        break;
      }

      const disponible = Number(lote.stockLote);
      const cantidad = Math.min(disponible, pendiente);

      if (cantidad <= 0) {
        continue;
      }

      asignaciones.push({ lote, cantidad });
      pendiente -= cantidad;
    }

    if (pendiente > 0) {
      throw new BadRequestException(
        `No fue posible asignar ${cantidadSolicitada} unidades mediante FEFO.`,
      );
    }

    return asignaciones;
  }

  private async resolverMetodoPagoVenta(
    tipoPagoSolicitado: TipoPagoVenta | undefined,
    ideMetoPago: number | null,
    ideClie: number,
    manager: EntityManager,
  ): Promise<{
    tipoPagoVent: TipoPagoVenta;
    ideMetoPago: number | null;
  }> {
    const tipoPagoBase = tipoPagoSolicitado ?? 'efectivo';

    if (ideMetoPago === null) {
      if (tipoPagoBase !== 'efectivo') {
        throw new BadRequestException(
          'Debe seleccionar un método de pago válido para ventas con tarjeta o PayPal.',
        );
      }

      return {
        tipoPagoVent: 'efectivo',
        ideMetoPago: null,
      };
    }

    const metodoPago = await this.posRepository.findMetodoPagoActivoByCliente(
      ideMetoPago,
      ideClie,
      manager,
    );

    if (!metodoPago) {
      throw new BadRequestException(
        'El método de pago seleccionado no existe, no está activo o no pertenece al cliente.',
      );
    }

    if (tipoPagoSolicitado && metodoPago.tipoPago !== tipoPagoSolicitado) {
      throw new BadRequestException(
        'El tipo de pago no coincide con el método de pago seleccionado.',
      );
    }

    return {
      tipoPagoVent: metodoPago.tipoPago,
      ideMetoPago,
    };
  }

  private validarItemsVenta(items: ItemVentaPosDto[]): void {
    if (!Array.isArray(items) || items.length === 0) {
      throw new BadRequestException(
        'Debe agregar al menos un producto a la venta.',
      );
    }

    for (const item of items) {
      const ideProd = IdUtil.parseId(item.ideProd);

      if (ideProd === null) {
        throw new BadRequestException(
          'Todos los ítems deben tener un producto válido.',
        );
      }

      if (
        item.cantidad === null ||
        item.cantidad === undefined ||
        Number.isNaN(Number(item.cantidad)) ||
        !Number.isInteger(Number(item.cantidad)) ||
        Number(item.cantidad) <= 0
      ) {
        throw new BadRequestException(
          'Todos los ítems deben tener una cantidad entera mayor que cero.',
        );
      }
    }
  }

  private fechaCalendario(value: Date | string): string {
    if (typeof value === 'string') {
      return value.slice(0, 10);
    }

    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
