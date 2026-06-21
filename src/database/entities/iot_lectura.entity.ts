import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IotAlertaEntity } from './iot_alerta.entity';
import { IotDispositivoEntity } from './iot_dispositivo.entity';

@Entity('iot_lecturas')
export class IotLecturaEntity {
  @PrimaryGeneratedColumn({ name: 'ide_lect' })
  ideLect!: number;

  @Column({ name: 'ide_disp', type: 'int' })
  ideDisp!: number;

  @Column({ name: 'temperatura_lect', type: 'double precision' })
  temperaturaLect!: number;

  @Column({ name: 'humedad_lect', type: 'double precision' })
  humedadLect!: number;

  @CreateDateColumn({ name: 'fecha_lect', type: 'timestamp' })
  fechaLect!: Date;

  @ManyToOne(
    () => IotDispositivoEntity,
    (dispositivo) => dispositivo.lecturas,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'ide_disp' })
  dispositivo?: IotDispositivoEntity;

  @OneToMany(() => IotAlertaEntity, (alerta) => alerta.lectura)
  alertas?: IotAlertaEntity[];
}
