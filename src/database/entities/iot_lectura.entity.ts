import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IotAlertaEntity } from './iot_alerta.entity';
import { IotDispositivoEntity } from './iot_dispositivo.entity';

@Entity({ name: 'iot_lecturas' })
@Index('idx_iot_lecturas_fecha', ['fechaLect'])
@Index('idx_iot_lecturas_ide_disp', ['ideDisp'])
export class IotLecturaEntity {
  @PrimaryGeneratedColumn({ name: 'ide_lect' })
  ideLect!: number;

  @Column({ name: 'ide_disp', type: 'int' })
  ideDisp!: number;

  @Column({ name: 'temperatura_lect', type: 'double precision' })
  temperaturaLect!: number;

  @Column({ name: 'humedad_lect', type: 'double precision' })
  humedadLect!: number;

  @Column({
    name: 'fecha_lect',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
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

export { IotLecturaEntity as IotLectura };
