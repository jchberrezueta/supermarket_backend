import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Entrega } from './entrega.entity';
import { Producto } from './producto.entity';

@Entity('detalle_entrega')
export class DetalleEntrega {
  @PrimaryGeneratedColumn({ name: 'ide_deta_entr' })
  id: number;

  @ManyToOne(() => Entrega, (entrega) => entrega.detalles)
  entrega: Entrega;

  @ManyToOne(() => Producto, (producto) => producto.detallesEntrega)
  producto: Producto;

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