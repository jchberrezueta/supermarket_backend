import { MoneyUtil } from '@common/utils/money.util';
import {
  DetalleEntregaEntity,
  DetalleEntregaLoteEntity,
  EntregaEntity,
} from '@entities';

export interface EntregaRow {
  ide_entr: number;
  ide_pedi: number;
  ide_prov: number;
  nombre_proveedor?: string | null;
  ide_empr?: number | null;
  nombre_empr?: string | null;
  fecha_pedi?: string | null;
  fecha_entr_pedi?: string | null;
  estado_pedi?: string | null;
  motivo_pedi?: string | null;
  fecha_entr: string;
  cantidad_total_entr: number;
  total_entr: number;
  estado_entr: string;
  observacion_entr: string | null;
  detalles?: DetalleEntregaRow[];
}

export interface DetalleEntregaLoteRow {
  ide_deta_entr_lote: number;
  ide_deta_entr: number;
  ide_lote: number | null;
  fecha_caducidad_lote: string;
  cantidad_lote: number;
  estado_deta_entr_lote: string;
  stock_lote?: number | null;
  estado_lote?: string | null;
}

export interface DetalleEntregaRow {
  ide_deta_entr: number;
  ide_entr: number;
  ide_deta_pedi: number | null;
  ide_prod: number;
  nombre_prod?: string | null;
  cantidad_prod: number;
  precio_unitario_prod: number;
  subtotal_prod: number;
  dcto_compra_prod: number;
  iva_prod: number;
  total_prod: number;
  dcto_caduc_prod: number;
  estado_deta_entr: string;
  cantidad_pedida?: number | null;
  estado_deta_pedi?: string | null;
  lotes_recibidos?: DetalleEntregaLoteRow[];
}

export class EntregasMapper {
  static toRow(entrega: EntregaEntity): EntregaRow {
    return {
      ide_entr: entrega.ideEntr,
      ide_pedi: entrega.idePedi,
      ide_prov: entrega.ideProv,
      nombre_proveedor: entrega.proveedor
        ? this.getNombreProveedor(entrega.proveedor)
        : null,
      ide_empr: entrega.pedido?.ideEmpr ?? null,
      nombre_empr: entrega.pedido?.empresa?.nombreEmpr ?? null,
      fecha_pedi: entrega.pedido
        ? this.formatDateTimeText(entrega.pedido.fechaPedi)
        : null,
      fecha_entr_pedi: entrega.pedido
        ? this.formatDateTimeText(entrega.pedido.fechaEntrPedi)
        : null,
      estado_pedi: entrega.pedido?.estadoPedi ?? null,
      motivo_pedi: entrega.pedido?.motivoPedi ?? null,
      fecha_entr: this.formatDateTimeInput(entrega.fechaEntr),
      cantidad_total_entr: entrega.cantidadTotalEntr,
      total_entr: MoneyUtil.toNumber(entrega.totalEntr),
      estado_entr: entrega.estadoEntr,
      observacion_entr: entrega.observacionEntr ?? null,
      detalles: entrega.detalles
        ? this.toDetalleRows(entrega.detalles)
        : undefined,
    };
  }

  static toRows(entregas: EntregaEntity[]): EntregaRow[] {
    return entregas.map((entrega) => this.toRow(entrega));
  }

  static toDetalleRow(detalle: DetalleEntregaEntity): DetalleEntregaRow {
    return {
      ide_deta_entr: detalle.ideDetaEntr,
      ide_entr: detalle.ideEntr,
      ide_deta_pedi: detalle.ideDetaPedi ?? null,
      ide_prod: detalle.ideProd,
      nombre_prod: detalle.producto?.nombreProd ?? null,
      cantidad_prod: detalle.cantidadProd,
      precio_unitario_prod: MoneyUtil.toNumber(detalle.precioUnitarioProd),
      subtotal_prod: MoneyUtil.toNumber(detalle.subtotalProd),
      dcto_compra_prod: MoneyUtil.toNumber(detalle.dctoCompraProd),
      iva_prod: MoneyUtil.toNumber(detalle.ivaProd),
      total_prod: MoneyUtil.toNumber(detalle.totalProd),
      dcto_caduc_prod: MoneyUtil.toNumber(detalle.dctoCaducProd),
      estado_deta_entr: detalle.estadoDetaEntr,
      cantidad_pedida: detalle.detallePedido?.cantidadProd ?? null,
      estado_deta_pedi: detalle.detallePedido?.estadoDetaPedi ?? null,
      lotes_recibidos: detalle.lotesRecibidos
        ? this.toDetalleLoteRows(detalle.lotesRecibidos)
        : [],
    };
  }

  static toDetalleRows(detalles: DetalleEntregaEntity[]): DetalleEntregaRow[] {
    return detalles.map((detalle) => this.toDetalleRow(detalle));
  }

  static toDetalleLoteRow(
    detalleLote: DetalleEntregaLoteEntity,
  ): DetalleEntregaLoteRow {
    return {
      ide_deta_entr_lote: detalleLote.ideDetaEntrLote,
      ide_deta_entr: detalleLote.ideDetaEntr,
      ide_lote: detalleLote.ideLote ?? null,
      fecha_caducidad_lote: this.formatDateOnly(detalleLote.fechaCaducidadLote),
      cantidad_lote: detalleLote.cantidadLote,
      estado_deta_entr_lote: detalleLote.estadoDetaEntrLote,
      stock_lote: detalleLote.lote?.stockLote ?? null,
      estado_lote: detalleLote.lote?.estadoLote ?? null,
    };
  }

  static toDetalleLoteRows(
    detallesLote: DetalleEntregaLoteEntity[],
  ): DetalleEntregaLoteRow[] {
    return detallesLote.map((detalleLote) =>
      this.toDetalleLoteRow(detalleLote),
    );
  }

  private static getNombreProveedor(proveedor: {
    primerNombreProv: string;
    segundoNombreProv?: string | null;
    apellidoPaternoProv: string;
    apellidoMaternoProv?: string | null;
  }): string {
    return [
      proveedor.primerNombreProv,
      proveedor.segundoNombreProv,
      proveedor.apellidoPaternoProv,
      proveedor.apellidoMaternoProv,
    ]
      .filter((value) => !!value)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private static formatDateTimeInput(value: Date | string): string {
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

  private static formatDateTimeText(value: Date | string): string {
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

  private static formatDateOnly(value: Date | string): string {
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

    return localDate.toISOString().slice(0, 10);
  }
}
