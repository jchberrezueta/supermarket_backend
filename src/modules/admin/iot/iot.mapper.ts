import { IotAlertaEntity } from '../../../database/entities/iot_alerta.entity';
import { IotDispositivoEntity } from '../../../database/entities/iot_dispositivo.entity';
import { IotLecturaEntity } from '../../../database/entities/iot_lectura.entity';

export class IotMapper {
  static normalizarCodigo(codigo: string): string {
    return codigo.trim().toUpperCase();
  }

  static toDispositivoResponse(dispositivo: IotDispositivoEntity) {
    return {
      ideDisp: dispositivo.ideDisp,
      codigoDisp: dispositivo.codigoDisp,
      nombreDisp: dispositivo.nombreDisp,
      ubicacionDisp: dispositivo.ubicacionDisp,
      tipoDisp: dispositivo.tipoDisp,
      estadoDisp: dispositivo.estadoDisp,
      descripcionDisp: dispositivo.descripcionDisp,
      fechaCreacionDisp: dispositivo.fechaCreacionDisp,
    };
  }

  static toLecturaResponse(lectura: IotLecturaEntity) {
    return {
      ideLect: lectura.ideLect,
      ideDisp: lectura.ideDisp,
      codigoDisp: lectura.dispositivo?.codigoDisp ?? null,
      nombreDisp: lectura.dispositivo?.nombreDisp ?? null,
      ubicacionDisp: lectura.dispositivo?.ubicacionDisp ?? null,
      temperaturaLect: Number(lectura.temperaturaLect),
      humedadLect: Number(lectura.humedadLect),
      fechaLect: lectura.fechaLect,
    };
  }

  static toAlertaResponse(alerta: IotAlertaEntity) {
    return {
      ideAler: alerta.ideAler,
      ideDisp: alerta.ideDisp,
      ideLect: alerta.ideLect,
      tipoAler: alerta.tipoAler,
      mensajeAler: alerta.mensajeAler,
      estadoAler: alerta.estadoAler,
      fechaAler: alerta.fechaAler,
    };
  }
}
