import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ClienteEntity } from './cliente.entity';
import { DetalleVentaEntity } from './detalle_venta.entity';
import { EmpleadoEntity } from './empleado.entity';

@Entity({ name: 'venta' })
export class VentaEntity {
  @PrimaryGeneratedColumn({ name: 'ide_vent' })
  ideVent!: number;

  @Column({ name: 'ide_empl', type: 'int', nullable: true })
  ideEmpl?: number;

  @Column({ name: 'ide_clie', type: 'int' })
  ideClie!: number;

  @Column({ name: 'num_factura_vent', type: 'varchar', length: 25 })
  numFacturaVent!: string;

  @Column({ name: 'fecha_vent', type: 'timestamp' })
  fechaVent!: Date;

  @Column({ name: 'cantidad_vent', type: 'int' })
  cantidadVent!: number;

  @Column({
    name: 'sub_total_vent',
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  subTotalVent!: string;

  @Column({
    name: 'total_vent',
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  totalVent!: string;

  @Column({
    name: 'dcto_socio_vent',
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  dctoSocioVent!: string;

  @Column({
    name: 'dcto_edad_vent',
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  dctoEdadVent!: string;

  @Column({
    name: 'estado_vent',
    type: 'varchar',
    length: 25,
    default: 'cancelado',
  })
  estadoVent!: 'completado' | 'cancelado' | 'devuelto';

  @Column({ name: 'usua_ingre', type: 'varchar', length: 25, nullable: true })
  usuaIngre?: string;

  @Column({
    name: 'fecha_ingre',
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaIngre?: Date;

  @Column({ name: 'usua_actua', type: 'varchar', length: 25, nullable: true })
  usuaActua?: string;

  @Column({ name: 'fecha_actua', type: 'timestamp', nullable: true })
  fechaActua?: Date;

  @Column({ name: 'ide_meto_pago', type: 'int', nullable: true })
  ideMetoPago?: number;

  @Column({
    name: 'tipo_pago_vent',
    type: 'varchar',
    length: 20,
    nullable: true,
    default: 'efectivo',
  })
  tipoPagoVent?: 'efectivo' | 'tarjeta_credito' | 'tarjeta_debito' | 'paypal';

  @ManyToOne(() => ClienteEntity, (cliente) => cliente.ventas)
  @JoinColumn({ name: 'ide_clie' })
  cliente?: ClienteEntity;

  @ManyToOne(() => EmpleadoEntity, (empleado) => empleado.ventas, {
    nullable: true,
  })
  @JoinColumn({ name: 'ide_empl' })
  empleado?: EmpleadoEntity;

  @OneToMany(() => DetalleVentaEntity, (detalle) => detalle.venta)
  detalles?: DetalleVentaEntity[];
}

export { VentaEntity as Venta };
