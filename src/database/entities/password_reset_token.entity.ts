import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CuentaEntity } from './cuenta.entity';

@Entity({ name: 'password_reset_token' })
@Index('uq_password_reset_token_hash', ['tokenHash'], { unique: true })
export class PasswordResetTokenEntity {
  @PrimaryGeneratedColumn({
    name: 'ide_prt',
  })
  idePrt!: number;

  @Column({
    name: 'ide_cuen',
    type: 'int',
  })
  ideCuen!: number;

  @Column({
    name: 'token_hash',
    type: 'varchar',
    length: 64,
  })
  tokenHash!: string;

  @Column({
    name: 'fecha_expiracion',
    type: 'timestamp',
  })
  fechaExpiracion!: Date;

  @Column({
    name: 'utilizado',
    type: 'boolean',
  })
  utilizado!: boolean;

  @Column({
    name: 'ip_solicitud',
    type: 'varchar',
    length: 45,
    nullable: true,
  })
  ipSolicitud?: string | null;

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

  @ManyToOne(() => CuentaEntity, (cuenta) => cuenta.passwordResetTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'ide_cuen',
  })
  cuenta?: CuentaEntity;
}
