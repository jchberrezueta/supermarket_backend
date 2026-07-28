import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CuentaEntity } from './cuenta.entity';

export type ResultadoAcceso = 'exitoso' | 'fallido';

@Entity({ name: 'acceso_usuario' })
export class AccesoUsuarioEntity {
  @PrimaryGeneratedColumn({
    name: 'ide_acce',
  })
  ideAcce!: number;

  @Column({
    name: 'ide_cuen',
    type: 'int',
    nullable: true,
  })
  ideCuen!: number | null;

  @Column({
    name: 'usuario_intentado',
    type: 'varchar',
    length: 25,
    nullable: true,
  })
  usuarioIntentado?: string | null;

  @Column({
    name: 'resultado_acce',
    type: 'varchar',
    length: 15,
  })
  resultadoAcce!: ResultadoAcceso;

  @Column({
    name: 'motivo_acce',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  motivoAcce?: string | null;

  @Column({
    name: 'navegador_acce',
    type: 'varchar',
    length: 250,
  })
  navegadorAcce!: string;

  @Column({
    name: 'fecha_acce',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaAcce!: Date;

  @Column({
    name: 'num_int_fall_acce',
    type: 'int',
  })
  numIntFallAcce!: number;

  @Column({
    name: 'ip_acce',
    type: 'varchar',
    length: 45,
    nullable: true,
  })
  ipAcce?: string | null;

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
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'ide_cuen',
  })
  cuenta?: CuentaEntity | null;
}

export { AccesoUsuarioEntity as AccesoUsuario };
