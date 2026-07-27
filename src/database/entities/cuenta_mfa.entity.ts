import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CuentaEntity } from './cuenta.entity';

@Entity({ name: 'cuenta_mfa' })
export class CuentaMfaEntity {
  @PrimaryGeneratedColumn({ name: 'ide_mfa' })
  ideMfa!: number;

  @Column({
    name: 'ide_cuen',
    type: 'int',
  })
  ideCuen!: number;

  @Column({
    name: 'habilitado',
    type: 'boolean',
    default: false,
  })
  habilitado!: boolean;

  @Column({
    name: 'secreto_mfa',
    type: 'varchar',
    length: 255,
  })
  secretoMfa!: string;

  @Column({
    name: 'fecha_activacion',
    type: 'timestamp',
    nullable: true,
  })
  fechaActivacion?: Date | null;

  @Column({
    name: 'fecha_ultimo_uso',
    type: 'timestamp',
    nullable: true,
  })
  fechaUltimoUso?: Date | null;

  @Column({
    name: 'usua_ingre',
    type: 'varchar',
    length: 25,
  })
  usuaIngre!: string;

  @Column({
    name: 'fecha_ingre',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaIngre!: Date;

  @Column({
    name: 'usua_actua',
    type: 'varchar',
    length: 25,
    nullable: true,
  })
  usuaActua?: string | null;

  @Column({
    name: 'fecha_actua',
    type: 'timestamp',
    nullable: true,
  })
  fechaActua?: Date | null;

  @ManyToOne(() => CuentaEntity, (cuenta) => cuenta.mfa, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'ide_cuen',
  })
  cuenta?: CuentaEntity;
}
