import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ClienteEntity } from './cliente.entity';

@Entity({ name: 'cuenta_cliente' })
@Index('cuenta_cliente_usuario_clie_key', ['usuarioClie'], { unique: true })
@Index('cuenta_cliente_email_clie_key', ['emailClie'], { unique: true })
export class CuentaClienteEntity {
  @PrimaryGeneratedColumn({ name: 'ide_cuen_clie' })
  ideCuenClie!: number;

  @Column({ name: 'ide_clie', type: 'int' })
  ideClie!: number;

  @Column({ name: 'usuario_clie', type: 'varchar', length: 50 })
  usuarioClie!: string;

  @Column({ name: 'email_clie', type: 'varchar', length: 100 })
  emailClie!: string;

  @Column({ name: 'password_clie', type: 'varchar', length: 255 })
  passwordClie!: string;

  @Column({ name: 'estado_clie', type: 'boolean', default: false })
  estadoClie!: boolean;

  @Column({
    name: 'fecha_ingre',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaIngre!: Date;

  @Column({ name: 'fecha_actua', type: 'timestamp', nullable: true })
  fechaActua?: Date | null;

  @ManyToOne(() => ClienteEntity, (cliente) => cliente.cuentasCliente, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ide_clie' })
  cliente?: ClienteEntity;
}

export { CuentaClienteEntity as CuentaCliente };
