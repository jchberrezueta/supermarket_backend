import { MoneyUtil } from '@common/utils/money.util';
import { DetallePedidoEntity, PedidoEntity } from '@entities';

export interface PedidoRow {
  ide_pedi: number;
  ide_empr: number;
  nombre_empr?: string | null;
  fecha_pedi: string;
  fecha_entr_pedi: string | null;
  cantidad_total_pedi: number;
  total_pedi: number;
  estado_pedi: string;
  motivo_pedi: string;
  observacion_pedi: string;
}

export interface DetallePedidoRow {
  ide_deta_pedi: number;
  ide_pedi: number;
  ide_prod: number;
  nombre_prod?: string | null;
  cantidad_prod: number;
  precio_unitario_prod: number;
  subtotal_prod: number;
  dcto_compra_prod: number;
  iva_prod: number;
  total_prod: number;
  dcto_caduc_prod: number;
  estado_deta_pedi: string;
}

export class PedidosMapper {
  static toRow(pedido: PedidoEntity): PedidoRow {
    return {
      ide_pedi: pedido.idePedi,
      ide_empr: pedido.ideEmpr,
      nombre_empr: pedido.empresa?.nombreEmpr ?? null,
      fecha_pedi: this.formatDateTimeDDMMYYYY(pedido.fechaPedi),
      fecha_entr_pedi: pedido.fechaEntrPedi
        ? this.formatCalendarDate(pedido.fechaEntrPedi)
        : null,
      cantidad_total_pedi: pedido.cantidadTotalPedi,
      total_pedi: MoneyUtil.toNumber(pedido.totalPedi),
      estado_pedi: pedido.estadoPedi,
      motivo_pedi: pedido.motivoPedi,
      observacion_pedi: pedido.observacionPedi,
    };
  }

  static toRows(pedidos: PedidoEntity[]): PedidoRow[] {
    return pedidos.map((pedido) => this.toRow(pedido));
  }

  static toDetalleRow(detalle: DetallePedidoEntity): DetallePedidoRow {
    return {
      ide_deta_pedi: detalle.ideDetaPedi,
      ide_pedi: detalle.idePedi,
      ide_prod: detalle.ideProd,
      nombre_prod: detalle.producto?.nombreProd ?? null,
      cantidad_prod: detalle.cantidadProd,
      precio_unitario_prod: MoneyUtil.toNumber(detalle.precioUnitarioProd),
      subtotal_prod: MoneyUtil.toNumber(detalle.subtotalProd),
      dcto_compra_prod: MoneyUtil.toNumber(detalle.dctoCompraProd),
      iva_prod: MoneyUtil.toNumber(detalle.ivaProd),
      total_prod: MoneyUtil.toNumber(detalle.totalProd),
      dcto_caduc_prod: MoneyUtil.toNumber(detalle.dctoCaducProd),
      estado_deta_pedi: detalle.estadoDetaPedi,
    };
  }

  static toDetalleRows(detalles: DetallePedidoEntity[]): DetallePedidoRow[] {
    return detalles.map((detalle) => this.toDetalleRow(detalle));
  }

  private static formatDateTimeDDMMYYYY(value: Date | string): string {
    if (!value) {
      return '';
    }

    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hour}:${minute}`;
  }

  private static formatCalendarDate(value: Date): string {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
