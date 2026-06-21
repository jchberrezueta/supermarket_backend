import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IotDispositivoEntity } from './iot_dispositivo.entity';
import { IotLecturaEntity } from './iot_lectura.entity';

@Entity('iot_alertas')
export class IotAlertaEntity {
  @PrimaryGeneratedColumn({ name: 'ide_aler' })
  ideAler!: number;

  @Column({ name: 'ide_disp', type: 'int' })
  ideDisp!: number;

  @Column({ name: 'ide_lect', type: 'int', nullable: true })
  ideLect?: number | null;

  @Column({ name: 'tipo_aler', type: 'varchar', length: 50 })
  tipoAler!: string;

  @Column({ name: 'mensaje_aler', type: 'varchar', length: 250 })
  mensajeAler!: string;

  @Column({
    name: 'estado_aler',
    type: 'varchar',
    length: 20,
    default: 'abierta',
  })
  estadoAler!: string;

  @CreateDateColumn({ name: 'fecha_aler', type: 'timestamp' })
  fechaAler!: Date;

  @ManyToOne(() => IotDispositivoEntity, (dispositivo) => dispositivo.alertas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ide_disp' })
  dispositivo?: IotDispositivoEntity;

  @ManyToOne(() => IotLecturaEntity, (lectura) => lectura.alertas, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'ide_lect' })
  lectura?: IotLecturaEntity | null;
}
