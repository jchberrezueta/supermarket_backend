import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}

export { DetalleVentaEntity as DetalleVenta };
