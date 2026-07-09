import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ClienteEntity } from './cliente.entity';

@Entity({ name: 'metodo_pago_cliente' })
export class MetodoPagoClienteEntity {
  @PrimaryGeneratedColumn({ name: 'ide_meto_pago' })
  ideMetoPago!: number;

  @Column({ name: 'ide_clie', type: 'int' })
  ideClie!: number;

  @Column({ name: 'tipo_pago', type: 'varchar', length: 20 })
  tipoPago!: 'tarjeta_credito' | 'tarjeta_debito' | 'paypal';

  @Column({ name: 'nombre_titular', type: 'varchar', length: 100 })
  nombreTitular!: string;

  @Column({
    name: 'numero_tarjeta_masked',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  numeroTarjetaMasked?: string | null;

  @Column({
    name: 'marca_tarjeta',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  marcaTarjeta?: 'visa' | 'mastercard' | 'amex' | 'diners' | null;

  @Column({
    name: 'fecha_expiracion',
    type: 'varchar',
    length: 7,
    nullable: true,
  })
  fechaExpiracion?: string | null;

  @Column({
    name: 'email_paypal',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  emailPaypal?: string | null;

  @Column({
    name: 'es_predeterminado',
    type: 'varchar',
    length: 2,
    default: 'no',
  })
  esPredeterminado!: 'si' | 'no';

  @Column({
    name: 'estado',
    type: 'varchar',
    length: 15,
    default: 'activo',
  })
  estado!: 'activo' | 'inactivo';

  @Column({
    name: 'alias',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  alias?: string | null;

  @Column({ name: 'usua_ingre', type: 'varchar', length: 25 })
  usuaIngre!: string;

  @Column({
    name: 'fecha_ingre',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaIngre!: Date;

  @Column({ name: 'usua_actua', type: 'varchar', length: 25, nullable: true })
  usuaActua?: string | null;

  @Column({ name: 'fecha_actua', type: 'timestamp', nullable: true })
  fechaActua?: Date | null;

  @ManyToOne(() => ClienteEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ide_clie' })
  cliente?: ClienteEntity;
}

export { MetodoPagoClienteEntity as MetodoPagoCliente };
