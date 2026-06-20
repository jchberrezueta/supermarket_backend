import { MoneyUtil } from '@common/utils/money.util';
import { DetalleVentaEntity, VentaEntity } from '@entities';

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
