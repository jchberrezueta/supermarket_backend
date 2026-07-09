import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CuentaEntity } from './cuenta.entity';

@Entity({ name: 'acceso_usuario' })
export class AccesoUsuarioEntity {
  @PrimaryGeneratedColumn({ name: 'ide_acce' })
  ideAcce!: number;

  @Column({ name: 'ide_cuen', type: 'int' })
  ideCuen!: number;

  @Column({ name: 'navegador_acce', type: 'varchar', length: 250 })
  navegadorAcce!: string;

  @Column({
    name: 'fecha_acce',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaAcce!: Date;

  @Column({ name: 'num_int_fall_acce', type: 'int' })
  numIntFallAcce!: number;

  @Column({ name: 'ip_acce', type: 'varchar', length: 15 })
  ipAcce!: string;

  @Column({
    name: 'latitud_acce',
    type: 'numeric',
    precision: 10,
    scale: 6,
    nullable: true,
  })
  latitudAcce?: string | null;

  @Column({
    name: 'longitud_acce',
    type: 'numeric',
    precision: 10,
    scale: 6,
    nullable: true,
  })
  longitudAcce?: string | null;

  @ManyToOne(() => CuentaEntity, (cuenta) => cuenta.accesos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ide_cuen' })
  cuenta?: CuentaEntity;
}

export { AccesoUsuarioEntity as AccesoUsuario };
