import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductoEntity } from './producto.entity';
import { VentaEntity } from './venta.entity';

@Entity({ name: 'detalle_venta' })
export class DetalleVentaEntity {
  @PrimaryGeneratedColumn({ name: 'ide_deta_vent' })
  ideDetaVent!: number;

  @Column({ name: 'ide_vent', type: 'int' })
  ideVent!: number;

  @Column({ name: 'ide_prod', type: 'int' })
  ideProd!: number;

  @Column({ name: 'cantidad_prod', type: 'int' })
  cantidadProd!: number;

  @Column({
    name: 'precio_unitario_prod',
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  precioUnitarioProd!: string;

  @Column({
    name: 'subtotal_prod',
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  subtotalProd!: string;

  @Column({
    name: 'dcto_promo_prod',
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  dctoPromoProd!: string;

  @Column({
    name: 'iva_prod',
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  ivaProd!: string;

  @Column({
    name: 'total_prod',
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  totalProd!: string;

  @ManyToOne(() => VentaEntity, (venta) => venta.detalles)
  @JoinColumn({ name: 'ide_vent' })
  venta?: VentaEntity;

  @ManyToOne(() => ProductoEntity, (producto) => producto.detallesVenta)
  @JoinColumn({ name: 'ide_prod' })
  producto?: ProductoEntity;
}

export { DetalleVentaEntity as DetalleVenta };
