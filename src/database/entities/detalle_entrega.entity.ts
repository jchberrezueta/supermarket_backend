import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'detalle_entrega' })
export class DetalleEntregaEntity {
  @PrimaryGeneratedColumn({ name: 'ide_deta_entr' })
  ideDetaEntr!: number;

  @Column({ name: 'ide_entr', type: 'int' })
  ideEntr!: number;

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
    name: 'dcto_compra_prod',
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  dctoCompraProd!: string;

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

  @Column({
    name: 'dcto_caduc_prod',
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  dctoCaducProd!: string;

  @Column({
    name: 'estado_deta_entr',
    type: 'varchar',
    length: 25,
    default: 'incompleto',
  })
  estadoDetaEntr!: 'completo' | 'incompleto';
}

export { DetalleEntregaEntity as DetalleEntrega };
