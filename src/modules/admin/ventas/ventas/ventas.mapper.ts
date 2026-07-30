import { MoneyUtil } from '@common/utils/money.util';
import {
  DetalleVentaEntity,
  MovimientoInventarioEntity,
  VentaEntity,
} from '@entities';

export interface VentaRow {
  ide_vent: number;
  ide_empl?: number | null;
  ide_clie: number;
  num_factura_vent: string;
  fecha_vent: string;
  cantidad_vent: number;
  sub_total_vent: number;
  total_vent: number;
  dcto_socio_vent: number;
  dcto_edad_vent: number;
  estado_vent: string;
  tipo_pago_vent?: string | null;
  ide_meto_pago?: number | null;
  canal_vent: string;
}

export interface DetalleVentaRow {
  ide_deta_vent: number;
  ide_vent: number;
  ide_prod: number;
  cantidad_prod: number;
  precio_unitario_prod: number;
  subtotal_prod: number;
  dcto_promo_prod: number;
  iva_prod: number;
  total_prod: number;
}


export interface MovimientoVentaRow {
  ide_movi: number;
  ide_deta_vent: number | null;
  ide_prod: number;
  ide_lote: number | null;
  fecha_caducidad_lote: string | null;
  tipo_movi: string;
  cantidad_movi: number;
  stock_prod_anterior: number | null;
  stock_prod_posterior: number | null;
  stock_lote_anterior: number | null;
  stock_lote_posterior: number | null;
  observacion_movi: string | null;
  usua_ingre: string;
  fecha_ingre: string;
}

export class VentasMapper {
  static toRow(venta: VentaEntity): VentaRow {
    return {
      ide_vent: venta.ideVent,
      ide_empl: venta.ideEmpl ?? null,
      ide_clie: venta.ideClie,
      num_factura_vent: venta.numFacturaVent,
      fecha_vent: this.formatDateTime(venta.fechaVent),
      cantidad_vent: venta.cantidadVent,
      sub_total_vent: MoneyUtil.toNumber(venta.subTotalVent),
      total_vent: MoneyUtil.toNumber(venta.totalVent),
      dcto_socio_vent: MoneyUtil.toNumber(venta.dctoSocioVent),
      dcto_edad_vent: MoneyUtil.toNumber(venta.dctoEdadVent),
      estado_vent: venta.estadoVent,
      tipo_pago_vent: venta.tipoPagoVent ?? null,
      ide_meto_pago: venta.ideMetoPago ?? null,
      canal_vent: this.formatCanal(venta.usuaIngre),
    };
  }

  static toRows(ventas: VentaEntity[]): VentaRow[] {
    return ventas.map((venta) => this.toRow(venta));
  }

  static toDetalleRow(detalle: DetalleVentaEntity): DetalleVentaRow {
    return {
      ide_deta_vent: detalle.ideDetaVent,
      ide_vent: detalle.ideVent,
      ide_prod: detalle.ideProd,
      cantidad_prod: detalle.cantidadProd,
      precio_unitario_prod: MoneyUtil.toNumber(detalle.precioUnitarioProd),
      subtotal_prod: MoneyUtil.toNumber(detalle.subtotalProd),
      dcto_promo_prod: MoneyUtil.toNumber(detalle.dctoPromoProd),
      iva_prod: MoneyUtil.toNumber(detalle.ivaProd),
      total_prod: MoneyUtil.toNumber(detalle.totalProd),
    };
  }

  static toDetalleRows(detalles: DetalleVentaEntity[]): DetalleVentaRow[] {
    return detalles.map((detalle) => this.toDetalleRow(detalle));
  }


  static toMovimientoRow(
    movimiento: MovimientoInventarioEntity,
  ): MovimientoVentaRow {
    return {
      ide_movi: movimiento.ideMovi,
      ide_deta_vent: movimiento.ideDetaVent ?? null,
      ide_prod: movimiento.ideProd,
      ide_lote: movimiento.ideLote ?? null,
      fecha_caducidad_lote: movimiento.lote
        ? this.formatCalendarDate(movimiento.lote.fechaCaducidadLote)
        : null,
      tipo_movi: movimiento.tipoMovi,
      cantidad_movi: movimiento.cantidadMovi,
      stock_prod_anterior: movimiento.stockProdAnterior ?? null,
      stock_prod_posterior: movimiento.stockProdPosterior ?? null,
      stock_lote_anterior: movimiento.stockLoteAnterior ?? null,
      stock_lote_posterior: movimiento.stockLotePosterior ?? null,
      observacion_movi: movimiento.observacionMovi ?? null,
      usua_ingre: movimiento.usuaIngre,
      fecha_ingre: this.formatDateTime(movimiento.fechaIngre),
    };
  }

  static toMovimientoRows(
    movimientos: MovimientoInventarioEntity[],
  ): MovimientoVentaRow[] {
    return movimientos.map((movimiento) => this.toMovimientoRow(movimiento));
  }

  private static formatCanal(value?: string | null): string {
    switch (String(value ?? '').toLowerCase()) {
      case 'pos':
        return 'POS';
      case 'mobile':
        return 'Móvil';
      case 'admin':
        return 'Administrativo / legado';
      default:
        return value || 'No identificado';
    }
  }

  private static formatCalendarDate(value: Date | string): string {
    if (typeof value === 'string') {
      return value.slice(0, 10);
    }

    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private static formatDateTime(value: Date | string): string {
    if (!value) {
      return '';
    }

    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000,
    );

    return localDate.toISOString().slice(0, 16);
  }
}
