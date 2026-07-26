import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CuentaEntity } from './cuenta.entity';

@Entity({ name: 'password_reset_token' })
export class PasswordResetTokenEntity {
  @PrimaryGeneratedColumn({ name: 'ide_prt' })
  idePrt!: number;

  @Column({
    name: 'ide_cuen',
    type: 'int',
  })
  ideCuen!: number;

  @Column({
    name: 'token_hash',
    type: 'varchar',
    length: 255,
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
    default: false,
  })
  utilizado!: boolean;

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
  usuaActua?: string;

  @Column({
    name: 'fecha_actua',
    type: 'timestamp',
    nullable: true,
  })
  fechaActua?: Date;

  @ManyToOne(() => CuentaEntity, (cuenta) => cuenta.passwordResetTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'ide_cuen',
  })
  cuenta?: CuentaEntity;
}
