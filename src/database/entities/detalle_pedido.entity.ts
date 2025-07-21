import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Pedido } from './pedido.entity';
import { Producto } from './producto.entity';

@Entity('detalle_pedido')
export class DetallePedido {
  @PrimaryGeneratedColumn({ name: 'ide_deta_pedi' })
  id: number;

  @ManyToOne(() => Producto, (producto) => producto.detallesPedido)
  producto: Producto;

  @ManyToOne(() => Pedido, (pedido) => pedido.detalles)
  pedido: Pedido;

  @Column({ name: 'cantidad_prod' })
  cantidad: number;

  @Column({ name: 'precio_unitario_prod', type: 'numeric', precision: 10, scale: 2 })
  precioUnitario: number;

  @Column({ name: 'dcto_prod', type: 'numeric', precision: 10, scale: 2 })
  descuento: number;

  @Column({ name: 'iva_prod', type: 'numeric', precision: 10, scale: 2 })
  iva: number;

  @Column({ name: 'subtotal_prod', type: 'numeric', precision: 10, scale: 2 })
  subtotal: number;
}