import { MoneyUtil } from '@common/utils/money.util';
import { AccesoUsuarioEntity } from '@entities';

export interface AccesoUsuarioRow {
  ide_acce: number;
  ide_cuen: number | null;
  usuario_intentado: string | null;
  usuario_cuen: string | null;
  estado_cuen: string | null;
  resultado_acce: string;
  motivo_acce: string | null;
  navegador_acce: string;
  fecha_acce: Date;
  num_int_fall_acce: number;
  ip_acce: string | null;
  latitud_acce: number | null;
  longitud_acce: number | null;
}

export class AccesosMapper {
  static toRow(acceso: AccesoUsuarioEntity): AccesoUsuarioRow {
    const usuario =
      acceso.usuarioIntentado ?? acceso.cuenta?.usuarioCuen ?? null;

    return {
      ide_acce: acceso.ideAcce,
      ide_cuen: acceso.ideCuen,
      usuario_intentado: acceso.usuarioIntentado ?? null,
      usuario_cuen: usuario,
      estado_cuen: acceso.cuenta?.estadoCuen ?? null,
      resultado_acce: acceso.resultadoAcce,
      motivo_acce: acceso.motivoAcce ?? null,
      navegador_acce: acceso.navegadorAcce,
      fecha_acce: acceso.fechaAcce,
      num_int_fall_acce: acceso.numIntFallAcce,
      ip_acce: acceso.ipAcce ?? null,
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
}
