import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateIotDispositivoDto } from './dto/create_iot_dispositivo.dto';
import { CreateIotLecturaDto } from './dto/create_iot_lectura.dto';
import { IotService } from './iot.service';

@Controller('iot')
export class IotController {
  constructor(private readonly iotService: IotService) {}

  @Post('dispositivos')
  crearDispositivo(@Body() dto: CreateIotDispositivoDto) {
    return this.iotService.crearDispositivo(dto);
  }

  @Get('dispositivos')
  listarDispositivos() {
    return this.iotService.listarDispositivos();
  }

  @Post('lecturas')
  recibirLectura(@Body() dto: CreateIotLecturaDto) {
    return this.iotService.recibirLectura(dto);
  }

  @Get('lecturas/ultima')
  obtenerUltimaLectura(@Query('codigoDispositivo') codigoDispositivo?: string) {
    return this.iotService.obtenerUltimaLectura(codigoDispositivo);
  }

  @Get('lecturas')
  listarLecturas(@Query('limit') limit?: string) {
    return this.iotService.listarLecturas(Number(limit));
  }

  @Get('alertas/abiertas')
  listarAlertasAbiertas() {
    return this.iotService.listarAlertasAbiertas();
  }
}
