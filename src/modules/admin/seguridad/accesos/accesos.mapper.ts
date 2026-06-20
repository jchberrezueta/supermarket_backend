import { MoneyUtil } from '@common/utils/money.util';
import { AccesoUsuarioEntity } from '@entities';

export interface AccesoUsuarioRow {
  ide_acce: number;
  ide_cuen: number;
  usuario_cuen?: string | null;
  estado_cuen?: string | null;
  navegador_acce: string;
  fecha_acce: string;
  num_int_fall_acce: number;
  ip_acce: string;
  latitud_acce?: number | null;
  longitud_acce?: number | null;
}

export class AccesosMapper {
  static toRow(acceso: AccesoUsuarioEntity): AccesoUsuarioRow {
    return {
      ide_acce: acceso.ideAcce,
      ide_cuen: acceso.ideCuen,
      usuario_cuen: acceso.cuenta?.usuarioCuen ?? null,
      estado_cuen: acceso.cuenta?.estadoCuen ?? null,
      navegador_acce: acceso.navegadorAcce,
      fecha_acce: this.formatDateTime(acceso.fechaAcce),
      num_int_fall_acce: acceso.numIntFallAcce,
      ip_acce: acceso.ipAcce,
      latitud_acce:
        acceso.latitudAcce !== null && acceso.latitudAcce !== undefined
          ? MoneyUtil.toNumber(acceso.latitudAcce)
          : null,
      longitud_acce:
        acceso.longitudAcce !== null && acceso.longitudAcce !== undefined
          ? MoneyUtil.toNumber(acceso.longitudAcce)
          : null,
    };
  }

  static toRows(accesos: AccesoUsuarioEntity[]): AccesoUsuarioRow[] {
    return accesos.map((acceso) => this.toRow(acceso));
  }

  private static formatDateTime(value?: Date | string): string {
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
}
