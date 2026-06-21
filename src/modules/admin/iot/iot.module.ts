import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IotAlertaEntity } from '../../../database/entities/iot_alerta.entity';
import { IotDispositivoEntity } from '../../../database/entities/iot_dispositivo.entity';
import { IotLecturaEntity } from '../../../database/entities/iot_lectura.entity';
import { IotController } from './iot.controller';
import { IotRepository } from './iot.repository';
import { IotService } from './iot.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      IotDispositivoEntity,
      IotLecturaEntity,
      IotAlertaEntity,
    ]),
  ],
  controllers: [IotController],
  providers: [IotService, IotRepository],
  exports: [IotService],
})
export class IotModule {}
