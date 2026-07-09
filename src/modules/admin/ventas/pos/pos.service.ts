import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { IdUtil } from '@common/index';
import { ProductoEntity } from '@entities';
import { DataSource } from 'typeorm';
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
      const itemsConsolidados = this.posCalculatorService.consolidarItems(
        dto.items,
      );

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

      const detallesCalculados: PosDetalleCalculado[] = [];
      const alertasStock: PosAlertaStock[] = [];
      const productosBloqueados = new Map<number, ProductoEntity>();

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
          tipoPagoVent: dto.tipoPagoVent ?? 'efectivo',
          ideMetoPago,
          usuaIngre: 'pos',
        },
        manager,
      );

      for (const detalle of detallesCalculados) {
        await this.posRepository.guardarDetalleVenta(
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

        if (!producto) {
          throw new BadRequestException(
            `El producto con ID ${detalle.ideProd} ya no está disponible.`,
          );
        }

        const productoConStockActualizado =
          this.stockPolicyService.descontarStock(
            producto,
            detalle.cantidad,
            'pos',
          );

        const productoActualizado = await this.posRepository.guardarProducto(
          productoConStockActualizado,
          manager,
        );

        const alertaStock =
          this.stockPolicyService.crearAlertaSiStockBajo(productoActualizado);

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
          detalles: detallesCalculados,
          alertasStock,
        },
        response: {
          success: true,
          message: 'Venta POS registrada correctamente.',
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

        const productoConStockRevertido = this.stockPolicyService.revertirStock(
          producto,
          detalle.cantidadProd,
          'pos',
        );

        const productoActualizado = await this.posRepository.guardarProducto(
          productoConStockRevertido,
          manager,
        );

        productosActualizados.push({
          ideProd: productoActualizado.ideProd,
          nombreProd: productoActualizado.nombreProd,
          stockActual: productoActualizado.stockProd,
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
          message: 'Venta cancelada correctamente y stock revertido.',
        },
      };
    });
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
        Number(item.cantidad) <= 0
      ) {
        throw new BadRequestException(
          'Todos los ítems deben tener una cantidad válida.',
        );
      }
    }
  }
}
