import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DetalleEntregaLoteEntity } from './detalle_entrega_lote.entity';
import { DetallePedidoEntity } from './detalle_pedido.entity';
import { EntregaEntity } from './entrega.entity';
import { ProductoEntity } from './producto.entity';

export type EstadoDetalleEntrega = 'completo' | 'incompleto' | 'no_entregado';

@Entity({ name: 'detalle_entrega' })
export class DetalleEntregaEntity {
  @PrimaryGeneratedColumn({ name: 'ide_deta_entr' })
  ideDetaEntr!: number;

  @Column({ name: 'ide_entr', type: 'int' })
  ideEntr!: number;

  @Column({ name: 'ide_deta_pedi', type: 'int', nullable: true })
  ideDetaPedi?: number | null;

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
  estadoDetaEntr!: EstadoDetalleEntrega;

  @ManyToOne(() => EntregaEntity, (entrega) => entrega.detalles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ide_entr' })
  entrega?: EntregaEntity;

  @ManyToOne(
    () => DetallePedidoEntity,
    (detallePedido) => detallePedido.detallesEntrega,
    {
      nullable: true,
      onDelete: 'RESTRICT',
    },
  )
  @JoinColumn({ name: 'ide_deta_pedi' })
  detallePedido?: DetallePedidoEntity | null;

  @ManyToOne(() => ProductoEntity, (producto) => producto.detallesEntrega, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ide_prod' })
  producto?: ProductoEntity;

  @OneToMany(() => DetalleEntregaLoteEntity, (lote) => lote.detalleEntrega)
  lotesRecibidos?: DetalleEntregaLoteEntity[];
}

export { DetalleEntregaEntity as DetalleEntrega };
