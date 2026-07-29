import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { IdUtil, MoneyUtil } from '@common/index';
import {
  ClienteEntity,
  DetalleVentaEntity,
  LoteEntity,
  MetodoPagoClienteEntity,
  MovimientoInventarioEntity,
  ProductoEntity,
  VentaEntity,
} from '@entities';
import { DataSource, EntityManager } from 'typeorm';
import { CreateVentaClienteDto, CreateVentaDetalleDto } from './dto';

type TipoPagoVenta =
  | 'efectivo'
  | 'tarjeta_credito'
  | 'tarjeta_debito'
  | 'paypal';

interface AsignacionLoteVentaMobile {
  lote: LoteEntity;
  cantidad: number;
}

export interface DetalleVentaCalculado {
  ideProd: number;
  nombreProd: string;
  imagenProd: string | null;
  cantidadProd: number;
  precioUnitarioProd: number;
  subtotalProd: number;
  dctoPromoProd: number;
  ivaProd: number;
  totalProd: number;
}

export interface TotalesVentaCalculados {
  cantidadVent: number;
  subTotalVent: number;
  dctoPromoVent: number;
  ivaVent: number;
  totalVent: number;
}

@Injectable()
export class MobileVentasService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async crearVenta(body: CreateVentaClienteDto, idClienteToken: number) {
    const ideClie = IdUtil.requireId(
      idClienteToken,
      'El ID del cliente no es válido.',
    );

    this.validarDetalleVenta(body.detalleVenta);

    const venta = await this.dataSource.transaction(async (manager) => {
      const cliente = await manager.getRepository(ClienteEntity).findOne({
        where: {
          ideClie,
        },
      });

      if (!cliente) {
        throw new BadRequestException('El cliente autenticado no existe.');
      }

      const cabecera = body.cabeceraVenta;

      const pagoValidado = await this.resolverMetodoPagoCliente(
        cabecera.tipoPagoVent,
        cabecera.ideMetoPago ?? null,
        ideClie,
        manager,
      );

      const itemsConsolidados = this.consolidarItems(body.detalleVenta);
      const detallesCalculados: DetalleVentaCalculado[] = [];
      const productosBloqueados = new Map<number, ProductoEntity>();
      const lotesPorProducto = new Map<
        number,
        AsignacionLoteVentaMobile[]
      >();

      for (const item of itemsConsolidados) {
        const producto = await this.buscarProductoActivoForUpdate(
          item.ideProd,
          manager,
        );

        if (!producto) {
          throw new BadRequestException(
            `El producto con ID ${item.ideProd} no existe o no está activo.`,
          );
        }

        if (producto.stockProd < item.cantidadProd) {
          throw new BadRequestException(
            `Stock insuficiente para "${producto.nombreProd}". Disponible: ${producto.stockProd}, solicitado: ${item.cantidadProd}.`,
          );
        }

        const lotes = await this.buscarLotesVendiblesFefoForUpdate(
          item.ideProd,
          manager,
        );

        const stockVendible = lotes.reduce(
          (total, lote) => total + Number(lote.stockLote),
          0,
        );

        if (stockVendible < item.cantidadProd) {
          throw new BadRequestException(
            `Stock vendible insuficiente para "${producto.nombreProd}". ` +
              `Disponible en lotes vigentes: ${stockVendible}, solicitado: ${item.cantidadProd}.`,
          );
        }

        lotesPorProducto.set(
          item.ideProd,
          this.asignarLotesFefo(lotes, item.cantidadProd),
        );

        detallesCalculados.push(
          this.calcularDetalleDesdeProducto(producto, item.cantidadProd),
        );

        productosBloqueados.set(producto.ideProd, producto);
      }

      const totales = this.calcularTotales(detallesCalculados);

      const ventaRepository = manager.getRepository(VentaEntity);

      const ventaCreada = ventaRepository.create({
        ideEmpl: null,
        ideClie,
        numFacturaVent:
          cabecera.numFacturaVent || this.generarNumeroFacturaMobile(),
        fechaVent: cabecera.fechaVent
          ? new Date(cabecera.fechaVent)
          : new Date(),
        cantidadVent: totales.cantidadVent,
        subTotalVent: MoneyUtil.toMoneyString(totales.subTotalVent),
        dctoSocioVent: MoneyUtil.toMoneyString(cabecera.dctoSocioVent ?? 0),
        dctoEdadVent: MoneyUtil.toMoneyString(cabecera.dctoEdadVent ?? 0),
        totalVent: MoneyUtil.toMoneyString(
          MoneyUtil.subtract(
            totales.totalVent,
            MoneyUtil.add(
              cabecera.dctoSocioVent ?? 0,
              cabecera.dctoEdadVent ?? 0,
            ),
          ),
        ),
        estadoVent: 'completado',
        tipoPagoVent: pagoValidado.tipoPagoVent,
        ideMetoPago: pagoValidado.ideMetoPago,
        // El canal se fija en backend; no se confía en el valor enviado.
        usuaIngre: 'mobile',
      });

      const ventaGuardada = await ventaRepository.save(ventaCreada);

      for (const detalle of detallesCalculados) {
        const detalleVenta = manager.getRepository(DetalleVentaEntity).create({
          ideVent: ventaGuardada.ideVent,
          ideProd: detalle.ideProd,
          cantidadProd: detalle.cantidadProd,
          precioUnitarioProd: MoneyUtil.toMoneyString(
            detalle.precioUnitarioProd,
          ),
          subtotalProd: MoneyUtil.toMoneyString(detalle.subtotalProd),
          dctoPromoProd: MoneyUtil.toMoneyString(detalle.dctoPromoProd),
          ivaProd: MoneyUtil.toMoneyString(detalle.ivaProd),
          totalProd: MoneyUtil.toMoneyString(detalle.totalProd),
        });

        const detalleGuardado = await manager
          .getRepository(DetalleVentaEntity)
          .save(detalleVenta);

        const producto = productosBloqueados.get(detalle.ideProd);
        const asignaciones = lotesPorProducto.get(detalle.ideProd) ?? [];

        if (!producto || !asignaciones.length) {
          throw new BadRequestException(
            `No se pudo resolver el inventario FEFO del producto ${detalle.ideProd}.`,
          );
        }

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
          await manager.getRepository(LoteEntity).save(lote);

          producto.stockProd = stockProdAnterior - cantidad;
          producto.disponibleProd = producto.stockProd > 0 ? 'si' : 'no';
          producto.usuaActua = 'mobile';
          producto.fechaActua = new Date();
          await manager.getRepository(ProductoEntity).save(producto);

          const movimiento = manager
            .getRepository(MovimientoInventarioEntity)
            .create({
              ideProd: detalle.ideProd,
              ideLote: lote.ideLote,
              ideDetaEntr: null,
              ideDetaVent: detalleGuardado.ideDetaVent,
              tipoMovi: 'salida_venta',
              cantidadMovi: -cantidad,
              stockProdAnterior,
              stockProdPosterior: Number(producto.stockProd),
              stockLoteAnterior,
              stockLotePosterior: Number(lote.stockLote),
              observacionMovi:
                `Venta móvil ${ventaGuardada.numFacturaVent}. ` +
                `Producto ${detalle.ideProd}, lote ${lote.ideLote}, ` +
                `caducidad ${this.fechaCalendario(lote.fechaCaducidadLote)}.`,
              usuaIngre: 'mobile',
            });

          await manager
            .getRepository(MovimientoInventarioEntity)
            .save(movimiento);
        }
      }

      return {
        venta: ventaGuardada,
        detalles: detallesCalculados,
        totales,
      };
    });

    return {
      success: true,
      message: 'Venta móvil registrada correctamente con inventario FEFO.',
      ideVenta: venta.venta.ideVent,
      data: {
        ideVent: venta.venta.ideVent,
        numFacturaVent: venta.venta.numFacturaVent,
        cantidadVent: venta.totales.cantidadVent,
        subTotalVent: venta.totales.subTotalVent,
        ivaVent: venta.totales.ivaVent,
        descuentoVent: venta.totales.dctoPromoVent,
        totalVent: Number(venta.venta.totalVent),
        detalles: venta.detalles,
      },
    };
  }

  async obtenerHistorialCliente(idCliente: number) {
    const ideClie = IdUtil.parseId(idCliente);

    if (ideClie === null) {
      return [];
    }

    const ventas = await this.dataSource.transaction((manager) =>
      manager.getRepository(VentaEntity).find({
        where: {
          ideClie,
        },
        order: {
          fechaVent: 'DESC',
          ideVent: 'DESC',
        },
      }),
    );

    return ventas.map((venta) => this.mapearVentaACamelCase(venta));
  }

  async obtenerDetalleVenta(idVenta: number, idCliente: number) {
    const ideVent = IdUtil.requireId(
      idVenta,
      'El ID de la venta no es válido.',
    );
    const ideClie = IdUtil.requireId(
      idCliente,
      'El ID del cliente no es válido.',
    );

    const venta = await this.dataSource.transaction((manager) =>
      manager.getRepository(VentaEntity).findOne({
        where: {
          ideVent,
          ideClie,
        },
        relations: {
          detalles: {
            producto: true,
          },
        },
      }),
    );

    if (!venta) {
      throw new NotFoundException('Venta no encontrada.');
    }

    return {
      venta: this.mapearVentaACamelCase(venta),
      detalles: (venta.detalles ?? []).map((detalle) =>
        this.mapearDetalleVentaACamelCase(detalle),
      ),
    };
  }

  private validarDetalleVenta(detalles: CreateVentaDetalleDto[]): void {
    if (!Array.isArray(detalles) || detalles.length === 0) {
      throw new BadRequestException(
        'Debe agregar al menos un producto a la venta.',
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

  private consolidarItems(
    detalles: CreateVentaDetalleDto[],
  ): CreateVentaDetalleDto[] {
    const mapa = new Map<number, CreateVentaDetalleDto>();

    for (const detalle of detalles) {
      const ideProd = IdUtil.requireId(
        detalle.ideProd,
        'El ID del producto no es válido.',
      );

      const existente = mapa.get(ideProd);

      if (existente) {
        existente.cantidadProd += detalle.cantidadProd;
        continue;
      }

      mapa.set(ideProd, {
        ...detalle,
        ideProd,
      });
    }

    return Array.from(mapa.values());
  }

  private async buscarProductoActivoForUpdate(
    ideProd: number,
    manager: EntityManager,
  ): Promise<ProductoEntity | null> {
    return manager
      .getRepository(ProductoEntity)
      .createQueryBuilder('producto')
      .setLock('pessimistic_write')
      .where('producto.ideProd = :ideProd', { ideProd })
      .andWhere('producto.estadoProd = :estadoProd', {
        estadoProd: 'activo',
      })
      .getOne();
  }

  private async buscarLotesVendiblesFefoForUpdate(
    ideProd: number,
    manager: EntityManager,
  ): Promise<LoteEntity[]> {
    return manager
      .getRepository(LoteEntity)
      .createQueryBuilder('lote')
      .setLock('pessimistic_write')
      .where('lote.ideProd = :ideProd', { ideProd })
      .andWhere('lote.stockLote > 0')
      .andWhere('DATE(lote.fechaCaducidadLote) >= CURRENT_DATE')
      .andWhere('lote.estadoLote <> :estadoDevuelto', {
        estadoDevuelto: 'devuelto',
      })
      .orderBy('lote.fechaCaducidadLote', 'ASC')
      .addOrderBy('lote.ideLote', 'ASC')
      .getMany();
  }

  private asignarLotesFefo(
    lotes: LoteEntity[],
    cantidadSolicitada: number,
  ): AsignacionLoteVentaMobile[] {
    let pendiente = cantidadSolicitada;
    const asignaciones: AsignacionLoteVentaMobile[] = [];

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

  private fechaCalendario(value: Date | string): string {
    if (typeof value === 'string') {
      return value.slice(0, 10);
    }

    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private async resolverMetodoPagoCliente(
    tipoPagoSolicitado: TipoPagoVenta | undefined,
    ideMetoPagoRaw: number | null | undefined,
    ideClie: number,
    manager: EntityManager,
  ): Promise<{
    tipoPagoVent: TipoPagoVenta;
    ideMetoPago: number | null;
  }> {
    const tipoPagoBase = tipoPagoSolicitado ?? 'efectivo';

    const ideMetoPago =
      ideMetoPagoRaw === null || ideMetoPagoRaw === undefined
        ? null
        : IdUtil.requireId(
            ideMetoPagoRaw,
            'El ID del método de pago no es válido.',
          );

    if (ideMetoPago === null) {
      /*
       * La app móvil permite pagar directamente con efectivo, tarjeta o
       * PayPal sin obligar al cliente a guardar el método. En ese caso se
       * registra únicamente el tipo de pago y no una referencia guardada.
       */
      return {
        tipoPagoVent: tipoPagoBase,
        ideMetoPago: null,
      };
    }

    const metodoPago = await manager
      .getRepository(MetodoPagoClienteEntity)
      .findOne({
        where: {
          ideMetoPago,
          ideClie,
          estado: 'activo',
        },
      });

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

  private calcularDetalleDesdeProducto(
    producto: ProductoEntity,
    cantidad: number,
  ): DetalleVentaCalculado {
    const precioUnitario = MoneyUtil.toNumber(producto.precioVentaProd);
    const tasaIva = MoneyUtil.normalizeRate(producto.ivaProd);
    const descuentoUnitario = MoneyUtil.toNumber(producto.dctoPromoProd);

    const subtotalBruto = MoneyUtil.multiply(precioUnitario, cantidad);
    const descuento = MoneyUtil.multiply(descuentoUnitario, cantidad);

    if (descuento > subtotalBruto) {
      throw new BadRequestException(
        `El descuento del producto ${producto.nombreProd} no puede superar el subtotal.`,
      );
    }

    const baseImponible = MoneyUtil.subtract(subtotalBruto, descuento);
    const iva = MoneyUtil.round(baseImponible * tasaIva);
    const total = MoneyUtil.add(baseImponible, iva);

    return {
      ideProd: producto.ideProd,
      nombreProd: producto.nombreProd,
      imagenProd: producto.urlImgProd ?? null,
      cantidadProd: cantidad,
      precioUnitarioProd: precioUnitario,
      subtotalProd: baseImponible,
      dctoPromoProd: descuento,
      ivaProd: iva,
      totalProd: total,
    };
  }

  private calcularTotales(
    detalles: DetalleVentaCalculado[],
  ): TotalesVentaCalculados {
    return detalles.reduce<TotalesVentaCalculados>(
      (totales, detalle) => ({
        cantidadVent: totales.cantidadVent + detalle.cantidadProd,
        subTotalVent: MoneyUtil.add(totales.subTotalVent, detalle.subtotalProd),
        dctoPromoVent: MoneyUtil.add(
          totales.dctoPromoVent,
          detalle.dctoPromoProd,
        ),
        ivaVent: MoneyUtil.add(totales.ivaVent, detalle.ivaProd),
        totalVent: MoneyUtil.add(totales.totalVent, detalle.totalProd),
      }),
      {
        cantidadVent: 0,
        subTotalVent: 0,
        dctoPromoVent: 0,
        ivaVent: 0,
        totalVent: 0,
      },
    );
  }

  private generarNumeroFacturaMobile(): string {
    const timestamp = Date.now().toString();
    return `MOB-${timestamp}`;
  }

  private mapearVentaACamelCase(venta: VentaEntity) {
    return {
      ideVent: venta.ideVent,
      ideClie: venta.ideClie,
      ideEmpl: venta.ideEmpl ?? null,
      numFacturaVent: venta.numFacturaVent,
      fechaVent: venta.fechaVent,
      cantidadVent: venta.cantidadVent,
      subTotalVent: Number(venta.subTotalVent) || 0,
      dctoSocioVent: Number(venta.dctoSocioVent) || 0,
      dctoEdadVent: Number(venta.dctoEdadVent) || 0,
      totalVent: Number(venta.totalVent) || 0,
      estadoVent: venta.estadoVent,
      tipoPagoVent: venta.tipoPagoVent,
      ideMetoPago: venta.ideMetoPago ?? null,
      fechaIngre: venta.fechaIngre,
    };
  }

  private mapearDetalleVentaACamelCase(detalle: DetalleVentaEntity) {
    return {
      ideDetaVent: detalle.ideDetaVent,
      ideVent: detalle.ideVent,
      ideProd: detalle.ideProd,
      cantidadProd: detalle.cantidadProd,
      precioUnitarioProd: Number(detalle.precioUnitarioProd) || 0,
      subtotalProd: Number(detalle.subtotalProd) || 0,
      dctoPromoProd: Number(detalle.dctoPromoProd) || 0,
      ivaProd: Number(detalle.ivaProd) || 0,
      totalProd: Number(detalle.totalProd) || 0,
      nombreProd: detalle.producto?.nombreProd ?? null,
      imagenProd: detalle.producto?.urlImgProd ?? null,
    };
  }
}
