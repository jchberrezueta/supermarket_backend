import { Injectable } from '@nestjs/common';

import {
  DetalleVentaEntity,
  EntregaEntity,
  MovimientoInventarioEntity,
  VentaEntity,
} from '@entities';

import {
  SIG_SNAPSHOT_CONTRACT_VERSION,
  SIG_SNAPSHOT_SOURCE,
  SigSnapshotV1,
} from './sig-snapshot.interface';

import { SigSnapshotSourceData } from './sig-snapshot.repository';

interface SaleAggregate {
  tax: number;
  promotionalDiscount: number;
}

@Injectable()
export class SigSnapshotMapper {
  toSnapshot(source: SigSnapshotSourceData): SigSnapshotV1 {
    const confirmedDeliveries = source.deliveries.filter((delivery) =>
      this.isConfirmedDelivery(delivery),
    );

    const receivedByOrder =
      this.calculateReceivedQuantityByOrder(confirmedDeliveries);

    const saleAggregates = this.calculateSaleAggregates(source.saleDetails);

    return {
      versionContrato: SIG_SNAPSHOT_CONTRACT_VERSION,

      fuente: SIG_SNAPSHOT_SOURCE,

      fechaGeneracion: new Date().toISOString(),

      categorias: source.categories.map((category) => ({
        idOrigen: category.ideCate,
        nombre: category.nombreCate.trim(),

        ...(category.descripcionCate
          ? {
              descripcion: category.descripcionCate.trim(),
            }
          : {}),
      })),

      empresas: source.companies.map((company) => ({
        idOrigen: company.ideEmpr,
        nombre: company.nombreEmpr.trim(),
        responsable: company.responsableEmpr.trim(),
        telefono: company.telefonoEmpr.trim(),
        correo: company.emailEmpr.trim(),
        estado: company.estadoEmpr,
      })),

      proveedores: source.suppliers.map((supplier) => ({
        idOrigen: supplier.ideProv,
        idEmpresaOrigen: supplier.ideEmpr,
        identificacion: supplier.cedulaProv.trim(),

        nombre: this.joinName([
          supplier.primerNombreProv,
          supplier.segundoNombreProv,
          supplier.apellidoPaternoProv,
          supplier.apellidoMaternoProv,
        ]),

        telefono: supplier.telefonoProv.trim(),

        correo: supplier.emailProv.trim(),

        estado: supplier.estadoProv,
      })),

      productos: source.products.map((product) => ({
        idOrigen: product.ideProd,
        idCategoriaOrigen: product.ideCate,
        codigoBarra: product.codigoBarraProd.trim(),
        nombre: product.nombreProd.trim(),
        stockActual: this.toInteger(product.stockProd, 'stock del producto'),
        stockMinimo: this.toInteger(
          product.stockMinimoProd,
          'stock mínimo del producto',
        ),
        precioVenta: this.toMoney(product.precioVentaProd, 'precio de venta'),
        estado: product.estadoProd,
      })),

      clientes: source.customers.map((customer) => ({
        idOrigen: customer.ideClie,
        identificacion: customer.cedulaClie.trim(),

        nombre: this.joinName([
          customer.primerNombreClie,
          customer.segundoNombreClie,
          customer.apellidoPaternoClie,
          customer.apellidoMaternoClie,
        ]),

        correo: customer.emailClie.trim(),

        telefono: customer.telefonoClie.trim(),
      })),

      ventas: source.sales.map((sale) =>
        this.mapSale(sale, saleAggregates.get(sale.ideVent)),
      ),

      detallesVenta: source.saleDetails.map((detail) => ({
        idOrigen: detail.ideDetaVent,

        idVentaOrigen: detail.ideVent,

        idProductoOrigen: detail.ideProd,

        cantidad: this.toInteger(
          detail.cantidadProd,
          'cantidad del detalle de venta',
        ),

        precioUnitario: this.toMoney(
          detail.precioUnitarioProd,
          'precio unitario del detalle de venta',
        ),

        subtotal: this.toMoney(
          detail.subtotalProd,
          'subtotal del detalle de venta',
        ),

        descuento: this.toMoney(
          detail.dctoPromoProd,
          'descuento del detalle de venta',
        ),

        iva: this.toMoney(detail.ivaProd, 'IVA del detalle de venta'),

        total: this.toMoney(detail.totalProd, 'total del detalle de venta'),
      })),

      pedidos: source.orders.map((order) => ({
        idOrigen: order.idePedi,
        idEmpresaOrigen: order.ideEmpr,
        motivo: order.motivoPedi,
        estado: order.estadoPedi,

        fechaPedido: this.toIsoTimestamp(order.fechaPedi, 'fecha del pedido'),

        ...(order.fechaEntrPedi
          ? {
              fechaEsperada: this.toIsoTimestamp(
                order.fechaEntrPedi,
                'fecha esperada del pedido',
              ),
            }
          : {}),

        cantidadSolicitada: this.toInteger(
          order.cantidadTotalPedi,
          'cantidad solicitada del pedido',
        ),

        cantidadRecibida: receivedByOrder.get(order.idePedi) ?? 0,

        total: this.toMoney(order.totalPedi, 'total del pedido'),
      })),

      entregas: confirmedDeliveries.map((delivery) => ({
        idOrigen: delivery.ideEntr,

        idPedidoOrigen: delivery.idePedi,

        idProveedorOrigen: delivery.ideProv,

        fechaEntrega: this.toIsoTimestamp(
          delivery.fechaEntr,
          'fecha de la entrega',
        ),

        estado: delivery.estadoEntr,

        cantidadRecibida: this.toInteger(
          delivery.cantidadTotalEntr,
          'cantidad recibida de la entrega',
        ),
      })),

      lotes: source.lots.map((lot) => ({
        idOrigen: lot.ideLote,
        idProductoOrigen: lot.ideProd,

        fechaCaducidad: this.toIsoCalendarDate(
          lot.fechaCaducidadLote,
          'fecha de caducidad del lote',
        ),

        stock: this.toInteger(lot.stockLote, 'stock del lote'),

        estado: lot.estadoLote,
      })),

      movimientos: source.movements.map((movement) =>
        this.mapMovement(movement),
      ),
    };
  }

  private mapSale(sale: VentaEntity, aggregate?: SaleAggregate) {
    const promotionalDiscount = aggregate?.promotionalDiscount ?? 0;

    const globalDiscount =
      this.toMoney(sale.dctoSocioVent, 'descuento de socio') +
      this.toMoney(sale.dctoEdadVent, 'descuento de tercera edad');

    return {
      idOrigen: sale.ideVent,

      idClienteOrigen: sale.ideClie,

      numeroFactura: sale.numFacturaVent.trim(),

      fechaVenta: this.toIsoTimestamp(sale.fechaVent, 'fecha de venta'),

      canal: this.mapSaleChannel(sale.usuaIngre),

      estado: sale.estadoVent,

      subtotal: this.toMoney(sale.subTotalVent, 'subtotal de venta'),

      descuento: this.roundMoney(globalDiscount + promotionalDiscount),

      iva: this.roundMoney(aggregate?.tax ?? 0),

      total: this.toMoney(sale.totalVent, 'total de venta'),
    };
  }

  private mapMovement(movement: MovimientoInventarioEntity) {
    const sourceDocument = this.resolveSourceDocument(movement);

    return {
      idOrigen: movement.ideMovi,

      idProductoOrigen: movement.ideProd,

      ...(movement.ideLote !== null && movement.ideLote !== undefined
        ? {
            idLoteOrigen: movement.ideLote,
          }
        : {}),

      tipo: movement.tipoMovi,

      cantidad: this.toInteger(
        movement.cantidadMovi,
        'cantidad del movimiento',
      ),

      ...(movement.stockProdAnterior !== null &&
      movement.stockProdAnterior !== undefined
        ? {
            stockProductoAnterior: this.toInteger(
              movement.stockProdAnterior,
              'stock anterior del producto',
            ),
          }
        : {}),

      ...(movement.stockProdPosterior !== null &&
      movement.stockProdPosterior !== undefined
        ? {
            stockProductoPosterior: this.toInteger(
              movement.stockProdPosterior,
              'stock posterior del producto',
            ),
          }
        : {}),

      ...(movement.stockLoteAnterior !== null &&
      movement.stockLoteAnterior !== undefined
        ? {
            stockLoteAnterior: this.toInteger(
              movement.stockLoteAnterior,
              'stock anterior del lote',
            ),
          }
        : {}),

      ...(movement.stockLotePosterior !== null &&
      movement.stockLotePosterior !== undefined
        ? {
            stockLotePosterior: this.toInteger(
              movement.stockLotePosterior,
              'stock posterior del lote',
            ),
          }
        : {}),

      ...(sourceDocument
        ? {
            documentoOrigen: sourceDocument,
          }
        : {}),

      ...(movement.usuaIngre
        ? {
            usuarioOrigen: movement.usuaIngre.trim(),
          }
        : {}),

      fechaMovimiento: this.toIsoTimestamp(
        movement.fechaIngre,
        'fecha del movimiento',
      ),
    };
  }

  private calculateSaleAggregates(
    details: DetalleVentaEntity[],
  ): Map<number, SaleAggregate> {
    const aggregates = new Map<number, SaleAggregate>();

    for (const detail of details) {
      const current = aggregates.get(detail.ideVent) ?? {
        tax: 0,
        promotionalDiscount: 0,
      };

      current.tax = this.roundMoney(
        current.tax + this.toMoney(detail.ivaProd, 'IVA del detalle de venta'),
      );

      current.promotionalDiscount = this.roundMoney(
        current.promotionalDiscount +
          this.toMoney(detail.dctoPromoProd, 'descuento promocional'),
      );

      aggregates.set(detail.ideVent, current);
    }

    return aggregates;
  }

  private calculateReceivedQuantityByOrder(
    deliveries: EntregaEntity[],
  ): Map<number, number> {
    const result = new Map<number, number>();

    for (const delivery of deliveries) {
      const current = result.get(delivery.idePedi) ?? 0;

      result.set(
        delivery.idePedi,
        current +
          this.toInteger(delivery.cantidadTotalEntr, 'cantidad de la entrega'),
      );
    }

    return result;
  }

  private isConfirmedDelivery(delivery: EntregaEntity): boolean {
    return (
      delivery.estadoEntr === 'parcial' || delivery.estadoEntr === 'completa'
    );
  }

  private mapSaleChannel(sourceUser: string): 'pos' | 'movil' {
    return sourceUser.trim().toLowerCase() === 'mobile' ? 'movil' : 'pos';
  }

  private resolveSourceDocument(movement: MovimientoInventarioEntity): string {
    const invoice = movement.detalleVenta?.venta?.numFacturaVent;

    if (invoice) {
      return invoice.trim();
    }

    const deliveryID = movement.detalleEntrega?.entrega?.ideEntr;

    if (deliveryID) {
      return `ENTREGA-${deliveryID}`;
    }

    return '';
  }

  private joinName(values: Array<string | null | undefined>): string {
    return values
      .map((value) => value?.trim())
      .filter((value): value is string => Boolean(value))
      .join(' ');
  }

  private toMoney(value: string | number, field: string): number {
    return this.roundMoney(this.toFiniteNumber(value, field));
  }

  private toInteger(value: string | number, field: string): number {
    return Math.trunc(this.toFiniteNumber(value, field));
  }

  private toFiniteNumber(value: string | number, field: string): number {
    const parsed = Number(value);

    if (!Number.isFinite(parsed)) {
      throw new Error(
        `El campo ${field} contiene un valor numérico no válido.`,
      );
    }

    return parsed;
  }

  private roundMoney(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  private toIsoTimestamp(value: Date | string, field: string): string {
    const parsed = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(parsed.getTime())) {
      throw new Error(`El campo ${field} contiene una fecha no válida.`);
    }

    return parsed.toISOString();
  }

  private toIsoCalendarDate(value: Date | string, field: string): string {
    let calendarDate: string;

    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      calendarDate = value;
    } else {
      const parsed = value instanceof Date ? value : new Date(value);

      if (Number.isNaN(parsed.getTime())) {
        throw new Error(`El campo ${field} contiene una fecha no válida.`);
      }

      calendarDate = parsed.toISOString().slice(0, 10);
    }

    return `${calendarDate}T00:00:00-05:00`;
  }
}
