import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Categoria } from './categoria.entity';
import { Marca } from './marca.entity';
import { DetallePedido } from './detalle_pedido.entity';
import { DetalleEntrega } from './detalle_entrega.entity';
import { DetalleVenta } from './detalle_venta.entity';
import { Lote } from './lote.entity';
import { EmpresaPrecios } from './empresa_precios.entity';

@Entity('producto')
export class Producto {
  @PrimaryGeneratedColumn({ name: 'ide_prod' })
  id: number;

  @ManyToOne(() => Categoria, (categoria) => categoria.productos)
  categoria: Categoria;

  @ManyToOne(() => Marca, (marca) => marca.productos)
  marca: Marca;

  @Column({ name: 'codigo_barra_prod', length: 30 })
  codigoBarra: string;

  @Column({ name: 'nombre_prod', length: 250 })
  nombre: string;

  @Column({ name: 'precio_compra_prod', type: 'numeric', precision: 10, scale: 2 })
  precioCompra: number;

  @Column({ name: 'precio_venta_prod', type: 'numeric', precision: 10, scale: 2 })
  precioVenta: number;

  @Column({ name: 'iva_prod', type: 'numeric', precision: 10, scale: 2 })
  iva: number;

  @Column({ name: 'dcto_caduc_prod', type: 'numeric', precision: 10, scale: 2 })
  descuentoCaducidad: number;

  @Column({ name: 'stock_prod' })
  stock: number;

  @Column({ name: 'dcto_promo_prod', type: 'numeric', precision: 10, scale: 2 })
  descuentoPromocion: number;

  @Column({ name: 'disponible_prod', length: 25 })
  disponible: string;

  @Column({ name: 'estado_prod', length: 25 })
  estado: string;

  @Column({ name: 'descripcion_prod', length: 250 })
  descripcion: string;

  @Column({ name: 'usua_ingre', length: 25, nullable: true })
  usuarioIngreso: string;

  @Column({ name: 'fecha_ingre', nullable: true })
  fechaIngreso: Date;

  @Column({ name: 'usua_actua', length: 25, nullable: true })
  usuarioActualiza: string;

  @Column({ name: 'fecha_actua', nullable: true })
  fechaActualiza: Date;

  @OneToMany(() => DetallePedido, (detalle) => detalle.producto)
  detallesPedido: DetallePedido[];

  @OneToMany(() => DetalleEntrega, (detalle) => detalle.producto)
  detallesEntrega: DetalleEntrega[];

  @OneToMany(() => DetalleVenta, (detalle) => detalle.producto)
  detallesVenta: DetalleVenta[];

  @OneToMany(() => Lote, (lote) => lote.producto)
  lotes: Lote[];

  @OneToMany(() => EmpresaPrecios, (empresaPrecio) => empresaPrecio.producto)
  preciosEmpresas: EmpresaPrecios[];
}