import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Venta } from './venta.entity';
import { Producto } from './producto.entity';

@Entity('detalle_venta')
export class DetalleVenta {
  @PrimaryGeneratedColumn({ name: 'ide_deta_vent' })
  id: number;

  @ManyToOne(() => Venta, (venta) => venta.detalles)
  venta: Venta;

  @ManyToOne(() => Producto, (producto) => producto.detallesVenta)
  producto: Producto;

  @Column({ name: 'cantidad_prod' })
  cantidad: number;

  @Column({ name: 'precio_unitario_prod', type: 'numeric', precision: 10, scale: 2 })
  precioUnitario: number;

  @Column({ name: 'dcto_prod', type: 'numeric', precision: 10, scale: 2 })
  descuento: number;

  @Column({ name: 'dcto_promo', type: 'numeric', precision: 10, scale: 2 })
  descuentoPromocion: number;

  @Column({ name: 'iva_prod', type: 'numeric', precision: 10, scale: 2 })
  iva: number;

  @Column({ name: 'subtotal_prod', type: 'numeric', precision: 10, scale: 2 })
  subtotal: number;
}