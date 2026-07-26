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
    name: 'usado',
    type: 'boolean',
    default: false,
  })
  usado!: boolean;

  @ManyToOne(() => CuentaEntity, (cuenta) => cuenta.passwordResetTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'ide_cuen',
  })
  cuenta?: CuentaEntity;
}
