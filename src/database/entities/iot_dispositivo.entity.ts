import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IotAlertaEntity } from './iot_alerta.entity';
import { IotLecturaEntity } from './iot_lectura.entity';

@Entity({ name: 'iot_dispositivos' })
@Index('iot_dispositivos_codigo_disp_key', ['codigoDisp'], { unique: true })
export class IotDispositivoEntity {
  @PrimaryGeneratedColumn({ name: 'ide_disp' })
  ideDisp!: number;

  @Column({ name: 'codigo_disp', type: 'varchar', length: 50 })
  codigoDisp!: string;

  @Column({ name: 'nombre_disp', type: 'varchar', length: 100 })
  nombreDisp!: string;

  @Column({ name: 'ubicacion_disp', type: 'varchar', length: 150 })
  ubicacionDisp!: string;

  @Column({
    name: 'tipo_disp',
    type: 'varchar',
    length: 50,
    default: 'esp32_dht22',
  })
  tipoDisp!: string;

  @Column({
    name: 'estado_disp',
    type: 'varchar',
    length: 20,
    default: 'activo',
  })
  estadoDisp!: 'activo' | 'inactivo';

  @Column({
    name: 'descripcion_disp',
    type: 'varchar',
    length: 250,
    default: 'ninguna',
  })
  descripcionDisp!: string;

  @Column({
    name: 'fecha_creacion_disp',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaCreacionDisp!: Date;

  @OneToMany(() => IotLecturaEntity, (lectura) => lectura.dispositivo)
  lecturas?: IotLecturaEntity[];

  @OneToMany(() => IotAlertaEntity, (alerta) => alerta.dispositivo)
  alertas?: IotAlertaEntity[];
}

export { IotDispositivoEntity as IotDispositivo };
