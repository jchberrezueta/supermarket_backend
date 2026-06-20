import { BadRequestException, Injectable } from '@nestjs/common';
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
    const precioUnitario = this.toNumber(producto.precioVentaProd);
    const tasaIva = this.normalizarTasaIva(producto.ivaProd);
    const descuentoUnitario = this.toNumber(producto.dctoPromoProd);

    const subtotalBruto = this.redondear(precioUnitario * cantidad);
    const descuento = this.redondear(descuentoUnitario * cantidad);

    if (descuento > subtotalBruto) {
      throw new BadRequestException(
        `El descuento del producto ${producto.nombreProd} no puede superar el subtotal.`,
      );
    }

    const baseImponible = this.redondear(subtotalBruto - descuento);
    const iva = this.redondear(baseImponible * tasaIva);
    const total = this.redondear(baseImponible + iva);

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
        subtotalVenta: this.redondear(totales.subtotalVenta + detalle.subtotal),
        ivaVenta: this.redondear(totales.ivaVenta + detalle.iva),
        descuentoVenta: this.redondear(
          totales.descuentoVenta + detalle.descuento,
        ),
        totalVenta: this.redondear(totales.totalVenta + detalle.total),
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

  private redondear(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }
}
