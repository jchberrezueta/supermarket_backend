import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CuentaEntity } from './cuenta.entity';

@Entity({ name: 'refresh_token' })
export class RefreshTokenEntity {
  @PrimaryGeneratedColumn({ name: 'ide_reft' })
  ideReft!: number;

  @Column({ name: 'ide_cuen', type: 'int' })
  ideCuen!: number;

  @Column({
    name: 'jti',
    type: 'varchar',
    length: 100,
  })
  jti!: string;

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
    name: 'revocado',
    type: 'boolean',
    default: false,
  })
  revocado!: boolean;

  @Column({
    name: 'ip_creacion',
    type: 'varchar',
    length: 45,
    nullable: true,
  })
  ipCreacion?: string | null;

  @Column({
    name: 'user_agent',
    type: 'varchar',
    length: 300,
    nullable: true,
  })
  userAgent?: string | null;

  @Column({
    name: 'nombre_dispositivo',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  nombreDispositivo?: string | null;

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

  @ManyToOne(() => CuentaEntity, (cuenta) => cuenta.refreshTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ide_cuen' })
  cuenta?: CuentaEntity;
}

export { RefreshTokenEntity as RefreshToken };
