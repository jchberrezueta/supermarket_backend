import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Proveedor } from './proveedor.entity';
import { Pedido } from './pedido.entity';
import { DetalleEntrega } from './detalle_entrega.entity';

@Entity('entrega')
export class Entrega {
  @PrimaryGeneratedColumn({ name: 'ide_entr' })
  id: number;

  @ManyToOne(() => Proveedor, (proveedor) => proveedor.entregas)
  proveedor: Proveedor;

  @ManyToOne(() => Pedido, (pedido) => pedido.entregas)
  pedido: Pedido;

  @Column({ name: 'fecha_entr' })
  fecha: Date;

  @Column({ name: 'cantidad_total_entr' })
  cantidadTotal: number;

  @Column({ name: 'total_entr', type: 'numeric', precision: 10, scale: 2 })
  total: number;

  @Column({ name: 'estado_entr', length: 25 })
  estado: string;

  @Column({ name: 'observacion_entr', length: 250 })
  observacion: string;

  @Column({ name: 'usua_ingre', length: 25, nullable: true })
  usuarioIngreso: string;

  @Column({ name: 'fecha_ingre', nullable: true })
  fechaIngreso: Date;

  @Column({ name: 'usua_actua', length: 25, nullable: true })
  usuarioActualiza: string;

  @Column({ name: 'fecha_actua', nullable: true })
  fechaActualiza: Date;

  @OneToMany(() => DetalleEntrega, (detalle) => detalle.entrega)
  detalles: DetalleEntrega[];
}