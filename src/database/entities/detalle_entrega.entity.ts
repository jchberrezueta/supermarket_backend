import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EntregaEntity } from './entrega.entity';
import { ProductoEntity } from './producto.entity';

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
  })
  precioUnitarioProd!: string;

  @Column({
    name: 'subtotal_prod',
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  subtotalProd!: string;

  @Column({
    name: 'dcto_compra_prod',
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  dctoCompraProd!: string;

  @Column({
    name: 'iva_prod',
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  ivaProd!: string;

  @Column({
    name: 'total_prod',
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  totalProd!: string;

  @Column({
    name: 'dcto_caduc_prod',
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  dctoCaducProd!: string;

  @Column({ name: 'estado_deta_entr', type: 'varchar', length: 25 })
  estadoDetaEntr!: 'completo' | 'incompleto';

  @ManyToOne(() => EntregaEntity, (entrega) => entrega.detalles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ide_entr' })
  entrega?: EntregaEntity;

  @ManyToOne(() => ProductoEntity, (producto) => producto.detallesEntrega, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ide_prod' })
  producto?: ProductoEntity;
}

export { DetalleEntregaEntity as DetalleEntrega };
