import { BadRequestException, Injectable } from '@nestjs/common';
import { MoneyUtil } from '@common/utils/money.util';
import { ProductoEntity } from '@entities';
import { ItemVentaPosDto } from '../dto/item_venta_pos.dto';

export interface PosDetalleCalculado {
  ideProd: number;
  nombreProd: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  iva: number;
  descuento: number;
  total: number;
}

export interface PosTotalesVenta {
  cantidadTotal: number;
  subtotalVenta: number;
  ivaVenta: number;
  descuentoVenta: number;
  totalVenta: number;
}

@Injectable()
export class PosCalculatorService {
  consolidarItems(items: ItemVentaPosDto[]): ItemVentaPosDto[] {
    const mapa = new Map<number, ItemVentaPosDto>();

    for (const item of items) {
      const existente = mapa.get(item.ideProd);

      if (existente) {
        existente.cantidad += item.cantidad;
        continue;
      }

      mapa.set(item.ideProd, {
        ideProd: item.ideProd,
        cantidad: item.cantidad,
      });
    }

    return Array.from(mapa.values());
  }

  calcularDetalle(
    producto: ProductoEntity,
    cantidad: number,
  ): PosDetalleCalculado {
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
      cantidad,
      precioUnitario,
      subtotal: baseImponible,
      iva,
      descuento,
      total,
    };
  }

  calcularTotales(detalles: PosDetalleCalculado[]): PosTotalesVenta {
    return detalles.reduce(
      (totales, detalle) => ({
        cantidadTotal: totales.cantidadTotal + detalle.cantidad,
        subtotalVenta: MoneyUtil.add(totales.subtotalVenta, detalle.subtotal),
        ivaVenta: MoneyUtil.add(totales.ivaVenta, detalle.iva),
        descuentoVenta: MoneyUtil.add(
          totales.descuentoVenta,
          detalle.descuento,
        ),
        totalVenta: MoneyUtil.add(totales.totalVenta, detalle.total),
      }),
      {
        cantidadTotal: 0,
        subtotalVenta: 0,
        ivaVenta: 0,
        descuentoVenta: 0,
        totalVenta: 0,
      },
    );
  }
}
