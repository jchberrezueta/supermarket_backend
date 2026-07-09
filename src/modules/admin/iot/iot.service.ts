import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { CreateIotDispositivoDto } from './dto/create_iot_dispositivo.dto';
import { CreateIotLecturaDto } from './dto/create_iot_lectura.dto';
import { IotMapper } from './iot.mapper';
import { IotRepository } from './iot.repository';

@Injectable()
export class IotService {
  private readonly temperaturaMaxima = 30;
  private readonly humedadMaxima = 75;
  private readonly limiteLecturasDefault = 50;
  private readonly limiteLecturasMaximo = 200;

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly iotRepository: IotRepository,
  ) {}

  async crearDispositivo(dto: CreateIotDispositivoDto) {
    const codigoDisp = IotMapper.normalizarCodigo(dto.codigoDispositivo);

    const dispositivo = await this.dataSource.transaction(async (manager) => {
      const existente = await this.iotRepository.buscarDispositivoPorCodigo(
        codigoDisp,
        manager,
      );

      if (existente) {
        throw new ConflictException(
          'Ya existe un dispositivo IoT con ese código.',
        );
      }

      return this.iotRepository.guardarDispositivo(
        {
          codigoDisp,
          nombreDisp: dto.nombreDispositivo,
          ubicacionDisp: dto.ubicacionDispositivo,
          tipoDisp: dto.tipoDispositivo ?? 'esp32_dht22',
          estadoDisp: dto.estadoDispositivo ?? 'activo',
          descripcionDisp: dto.descripcionDispositivo ?? 'ninguna',
        },
        manager,
      );
    });

    return {
      message: 'Dispositivo IoT registrado correctamente.',
      data: IotMapper.toDispositivoResponse(dispositivo),
    };
  }

  async listarDispositivos() {
    const dispositivos = await this.dataSource.transaction((manager) =>
      this.iotRepository.listarDispositivos(manager),
    );

    return {
      message: 'Dispositivos IoT obtenidos correctamente.',
      data: dispositivos.map(IotMapper.toDispositivoResponse),
    };
  }

  async recibirLectura(dto: CreateIotLecturaDto) {
    const codigoDisp = IotMapper.normalizarCodigo(dto.codigoDispositivo);

    return this.dataSource.transaction(async (manager) => {
      let dispositivo = await this.iotRepository.buscarDispositivoPorCodigo(
        codigoDisp,
        manager,
      );

      if (!dispositivo) {
        dispositivo = await this.iotRepository.guardarDispositivo(
          {
            codigoDisp,
            nombreDisp: `dispositivo ${codigoDisp.toLowerCase()}`,
            ubicacionDisp: 'bodega',
            tipoDisp: 'esp32_dht22',
            estadoDisp: 'activo',
            descripcionDisp: 'creado automáticamente desde lectura IoT',
          },
          manager,
        );
      }

      const lectura = await this.iotRepository.guardarLectura(
        {
          ideDisp: dispositivo.ideDisp,
          temperaturaLect: dto.temperatura,
          humedadLect: dto.humedad,
        },
        manager,
      );

      lectura.dispositivo = dispositivo;

      const alertas = await this.generarAlertasSiAplica(
        dispositivo.ideDisp,
        lectura.ideLect,
        dto.temperatura,
        dto.humedad,
        manager,
      );

      return {
        message: 'Lectura IoT registrada correctamente.',
        data: {
          lectura: IotMapper.toLecturaResponse(lectura),
          alertas,
        },
      };
    });
  }

  async obtenerUltimaLectura(codigoDispositivo?: string) {
    const codigoDisp = codigoDispositivo
      ? IotMapper.normalizarCodigo(codigoDispositivo)
      : undefined;

    const lectura = await this.dataSource.transaction((manager) =>
      this.iotRepository.obtenerUltimaLectura(codigoDisp, manager),
    );

    if (!lectura) {
      throw new NotFoundException('No existen lecturas IoT registradas.');
    }

    return {
      message: 'Última lectura IoT obtenida correctamente.',
      data: IotMapper.toLecturaResponse(lectura),
    };
  }

  async listarLecturas(limit?: number) {
    const limiteSeguro = this.normalizarLimiteLecturas(limit);

    const lecturas = await this.dataSource.transaction((manager) =>
      this.iotRepository.listarLecturas(limiteSeguro, manager),
    );

    return {
      message: 'Lecturas IoT obtenidas correctamente.',
      data: lecturas.map(IotMapper.toLecturaResponse),
    };
  }

  async listarAlertasAbiertas() {
    const alertas = await this.dataSource.transaction((manager) =>
      this.iotRepository.listarAlertasAbiertas(manager),
    );

    return {
      message: 'Alertas IoT abiertas obtenidas correctamente.',
      data: alertas.map(IotMapper.toAlertaResponse),
    };
  }

  async obtenerResumenBodega(codigoDispositivo?: string) {
    const codigoDisp = codigoDispositivo
      ? IotMapper.normalizarCodigo(codigoDispositivo)
      : undefined;

    const { lectura, alertas } = await this.dataSource.transaction(
      async (manager) => {
        const ultimaLectura = await this.iotRepository.obtenerUltimaLectura(
          codigoDisp,
          manager,
        );

        const alertasAbiertas =
          await this.iotRepository.listarAlertasAbiertas(manager);

        return {
          lectura: ultimaLectura,
          alertas: alertasAbiertas,
        };
      },
    );

    if (!lectura) {
      return {
        message: 'Resumen IoT de bodega obtenido correctamente.',
        data: {
          estadoAmbiental: 'sin_datos',
          mensajeEstado: 'No existen lecturas IoT registradas para la bodega.',
          ultimaLectura: null,
          limites: {
            temperaturaMaxima: this.temperaturaMaxima,
            humedadMaxima: this.humedadMaxima,
          },
          totalAlertasAbiertas: 0,
          alertasAbiertas: [],
        },
      };
    }

    const temperatura = Number(lectura.temperaturaLect);
    const humedad = Number(lectura.humedadLect);

    const temperaturaAlta = temperatura >= this.temperaturaMaxima;
    const humedadAlta = humedad >= this.humedadMaxima;

    let estadoAmbiental: 'normal' | 'alerta' | 'critico' = 'normal';
    let mensajeEstado = 'Condiciones ambientales normales en bodega.';

    if (temperaturaAlta && humedadAlta) {
      estadoAmbiental = 'critico';
      mensajeEstado =
        'Temperatura y humedad sobrepasan los límites permitidos.';
    } else if (temperaturaAlta) {
      estadoAmbiental = 'alerta';
      mensajeEstado = 'Temperatura alta detectada en bodega.';
    } else if (humedadAlta) {
      estadoAmbiental = 'alerta';
      mensajeEstado = 'Humedad alta detectada en bodega.';
    }

    const alertasDispositivo = alertas.filter((alerta) => {
      if (!codigoDisp) {
        return alerta.ideDisp === lectura.ideDisp;
      }

      return alerta.dispositivo?.codigoDisp === codigoDisp;
    });

    return {
      message: 'Resumen IoT de bodega obtenido correctamente.',
      data: {
        estadoAmbiental,
        mensajeEstado,
        dispositivo: {
          ideDisp: lectura.ideDisp,
          codigoDisp: lectura.dispositivo?.codigoDisp ?? null,
          nombreDisp: lectura.dispositivo?.nombreDisp ?? null,
          ubicacionDisp: lectura.dispositivo?.ubicacionDisp ?? null,
        },
        ultimaLectura: {
          ideLect: lectura.ideLect,
          temperaturaLect: temperatura,
          humedadLect: humedad,
          fechaLect: lectura.fechaLect,
        },
        limites: {
          temperaturaMaxima: this.temperaturaMaxima,
          humedadMaxima: this.humedadMaxima,
        },
        totalAlertasAbiertas: alertasDispositivo.length,
        alertasAbiertas: alertasDispositivo.map(IotMapper.toAlertaResponse),
      },
    };
  }

  private async generarAlertasSiAplica(
    ideDisp: number,
    ideLect: number,
    temperatura: number,
    humedad: number,
    manager: EntityManager,
  ) {
    const alertas = [];

    if (temperatura >= this.temperaturaMaxima) {
      const alertaAbierta = await this.iotRepository.buscarAlertaAbiertaPorTipo(
        ideDisp,
        'temperatura_alta',
        manager,
      );

      if (alertaAbierta) {
        alertas.push(IotMapper.toAlertaResponse(alertaAbierta));
      } else {
        const alerta = await this.iotRepository.guardarAlerta(
          {
            ideDisp,
            ideLect,
            tipoAler: 'temperatura_alta',
            mensajeAler: `Temperatura alta detectada: ${temperatura} °C.`,
            estadoAler: 'abierta',
          },
          manager,
        );

        alertas.push(IotMapper.toAlertaResponse(alerta));
      }
    }

    if (humedad >= this.humedadMaxima) {
      const alertaAbierta = await this.iotRepository.buscarAlertaAbiertaPorTipo(
        ideDisp,
        'humedad_alta',
        manager,
      );

      if (alertaAbierta) {
        alertas.push(IotMapper.toAlertaResponse(alertaAbierta));
      } else {
        const alerta = await this.iotRepository.guardarAlerta(
          {
            ideDisp,
            ideLect,
            tipoAler: 'humedad_alta',
            mensajeAler: `Humedad alta detectada: ${humedad} %.`,
            estadoAler: 'abierta',
          },
          manager,
        );

        alertas.push(IotMapper.toAlertaResponse(alerta));
      }
    }

    return alertas;
  }

  private normalizarLimiteLecturas(limit?: number): number {
    if (!Number.isInteger(limit) || !limit || limit <= 0) {
      return this.limiteLecturasDefault;
    }

    if (limit > this.limiteLecturasMaximo) {
      return this.limiteLecturasMaximo;
    }

    return limit;
  }
}
