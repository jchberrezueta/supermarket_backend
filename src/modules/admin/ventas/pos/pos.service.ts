import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfirmarVentaPosDto } from './dto/confirmar_venta_pos.dto';
import { PosRepository } from './pos.repository';

@Injectable()
export class PosService {
  private readonly stockMinimo = 5;

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly posRepository: PosRepository,
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
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException(
        'Debe agregar al menos un producto a la venta.',
      );
    }
    const ideEmpl = user.ideEmpl ?? dto.ideEmpl;

    if (ideEmpl === undefined || ideEmpl === null || Number.isNaN(ideEmpl)) {
      // que paso aqui?
      throw new BadRequestException(
        'No se pudo identificar el cajero de la venta.',
      );
    }

    return this.dataSource.transaction(async (manager) => {
      const itemsConsolidados = this.consolidarItems(dto.items);
      const numeroFactura = this.generarNumeroFactura();

      const cliente = await this.posRepository.findClienteById(
        dto.ideClie,
        manager,
      );

      if (!cliente) {
        throw new BadRequestException(
          'El cliente seleccionado no existe en el sistema.',
        );
      }

      let cantidadTotal = 0;
      let subtotalVenta = 0;
      let ivaVenta = 0;
      let descuentoVenta = 0;
      let totalVenta = 0;

      const detallesCalculados: Array<{
        ideProd: number;
        nombreProd: string;
        cantidad: number;
        precioUnitario: number;
        subtotal: number;
        iva: number;
        descuento: number;
        total: number;
      }> = [];

      const alertasStock: Array<{
        ideProd: number;
        nombreProd: string;
        stockActual: number;
        mensaje: string;
      }> = [];

      for (const item of itemsConsolidados) {
        const producto =
          await this.posRepository.findProductoActivoByIdForUpdate(
            item.ideProd,
            manager,
          );

        if (!producto) {
          throw new BadRequestException(
            `El producto con ID ${item.ideProd} no existe o no está activo.`,
          );
        }

        if (producto.stockProd < item.cantidad) {
          throw new BadRequestException(
            `Stock insuficiente para ${producto.nombreProd}. Disponible: ${producto.stockProd}`,
          );
        }

        const precioUnitario = this.toNumber(producto.precioVentaProd);
        const tasaIva = this.normalizarTasaIva(producto.ivaProd);
        const descuentoUnitario = this.toNumber(producto.dctoPromoProd);

        const subtotalBruto = this.redondear(precioUnitario * item.cantidad);
        const descuento = this.redondear(descuentoUnitario * item.cantidad);

        if (descuento > subtotalBruto) {
          throw new BadRequestException(
            `El descuento del producto ${producto.nombreProd} no puede superar el subtotal.`,
          );
        }

        const baseImponible = this.redondear(subtotalBruto - descuento);
        const iva = this.redondear(baseImponible * tasaIva);
        const total = this.redondear(baseImponible + iva);

        cantidadTotal += item.cantidad;
        subtotalVenta += baseImponible;
        ivaVenta += iva;
        descuentoVenta += descuento;
        totalVenta += total;

        detallesCalculados.push({
          ideProd: producto.ideProd,
          nombreProd: producto.nombreProd,
          cantidad: item.cantidad,
          precioUnitario,
          subtotal: baseImponible,
          iva,
          descuento,
          total,
        });
      }

      subtotalVenta = this.redondear(subtotalVenta);
      ivaVenta = this.redondear(ivaVenta);
      descuentoVenta = this.redondear(descuentoVenta);
      totalVenta = this.redondear(totalVenta);

      const venta = await this.posRepository.guardarVenta(
        {
          ideClie: dto.ideClie,
          ideEmpl,
          numFacturaVent: numeroFactura,
          fechaVent: new Date(),
          cantidadVent: cantidadTotal,
          subTotalVent: subtotalVenta.toFixed(2),
          totalVent: totalVenta.toFixed(2),
          dctoSocioVent: '0.00',
          dctoEdadVent: '0.00',
          estadoVent: 'completado',
          tipoPagoVent: dto.tipoPagoVent ?? 'efectivo',
          ideMetoPago: dto.ideMetoPago ?? null,
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

        const producto =
          await this.posRepository.findProductoActivoByIdForUpdate(
            detalle.ideProd,
            manager,
          );

        if (!producto) {
          throw new BadRequestException(
            `El producto con ID ${detalle.ideProd} ya no está disponible.`,
          );
        }

        producto.stockProd -= detalle.cantidad;
        producto.disponibleProd = producto.stockProd > 0 ? 'si' : 'no';
        producto.usuaActua = 'pos';
        producto.fechaActua = new Date();

        const productoActualizado = await this.posRepository.guardarProducto(
          producto,
          manager,
        );

        if (productoActualizado.stockProd <= this.stockMinimo) {
          alertasStock.push({
            ideProd: productoActualizado.ideProd,
            nombreProd: productoActualizado.nombreProd,
            stockActual: productoActualizado.stockProd,
            mensaje: `Stock bajo para ${productoActualizado.nombreProd}`,
          });
        }
      }

      return {
        data: {
          ideVent: venta.ideVent,
          numFacturaVent: venta.numFacturaVent,
          cantidadVent: cantidadTotal,
          subtotalVent: subtotalVenta,
          ivaVent: ivaVenta,
          descuentoVent: descuentoVenta,
          totalVent: totalVenta,
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
    if (!ideVent || ideVent <= 0) {
      throw new BadRequestException('El ID de la venta no es válido.');
    }

    return this.dataSource.transaction(async (manager) => {
      const venta = await this.posRepository.findVentaByIdForUpdate(
        ideVent,
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
        ideVent,
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
        const producto = await this.posRepository.findProductoByIdForUpdate(
          detalle.ideProd,
          manager,
        );

        if (!producto) {
          throw new BadRequestException(
            `No se encontró el producto ${detalle.ideProd} para revertir stock.`,
          );
        }

        producto.stockProd += detalle.cantidadProd;
        producto.disponibleProd = producto.stockProd > 0 ? 'si' : 'no';
        producto.usuaActua = 'pos';
        producto.fechaActua = new Date();

        const productoActualizado = await this.posRepository.guardarProducto(
          producto,
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

  private generarNumeroFactura(): string {
    const now = new Date();

    const fecha = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0'),
      String(now.getHours()).padStart(2, '0'),
      String(now.getMinutes()).padStart(2, '0'),
      String(now.getSeconds()).padStart(2, '0'),
    ].join('');

    const aleatorio = Math.floor(Math.random() * 900 + 100);

    return `POS-${fecha}-${aleatorio}`;
  }

  private toNumber(value: string | number | null | undefined): number {
    if (value === null || value === undefined) {
      return 0;
    }

    const numero = Number(value);

    if (Number.isNaN(numero)) {
      return 0;
    }

    return numero;
  }

  private normalizarTasaIva(value: string | number | null | undefined): number {
    const iva = this.toNumber(value);

    if (iva > 1) {
      return iva / 100;
    }

    return iva;
  }

  private consolidarItems(items: Array<{ ideProd: number; cantidad: number }>) {
    const mapa = new Map<number, { ideProd: number; cantidad: number }>();

    for (const item of items) {
      const existente = mapa.get(item.ideProd);

      if (existente) {
        existente.cantidad += item.cantidad;
      } else {
        mapa.set(item.ideProd, {
          ideProd: item.ideProd,
          cantidad: item.cantidad,
        });
      }
    }

    return Array.from(mapa.values());
  }

  private redondear(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }
}
