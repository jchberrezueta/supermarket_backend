import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PedidoEntity } from './pedido.entity';
import { ProductoEntity } from './producto.entity';

@Entity({ name: 'detalle_pedido' })
export class DetallePedidoEntity {
  @PrimaryGeneratedColumn({ name: 'ide_deta_pedi' })
  ideDetaPedi!: number;

  @Column({ name: 'ide_pedi', type: 'int' })
  idePedi!: number;

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

  @Column({ name: 'estado_deta_pedi', type: 'varchar', length: 25 })
  estadoDetaPedi!: 'progreso' | 'completado' | 'incompleto' | 'emitido';

  @ManyToOne(() => PedidoEntity, (pedido) => pedido.detalles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ide_pedi' })
  pedido?: PedidoEntity;

  @ManyToOne(() => ProductoEntity, (producto) => producto.detallesPedido, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ide_prod' })
  producto?: ProductoEntity;
}

export { DetallePedidoEntity as DetallePedido };
