import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Empresa } from './empresas.entity';
import { DetallePedido } from './detalle_pedido.entity';
import { Entrega } from './entrega.entity';

@Entity('pedido')
export class Pedido {
  @PrimaryGeneratedColumn({ name: 'ide_pedi' })
  id: number;

  @ManyToOne(() => Empresa, (empresa) => empresa.pedidos)
  empresa: Empresa;

  @Column({ name: 'fecha_pedi' })
  fecha: Date;

  @Column({ name: 'fecha_entr_pedi' })
  fechaEntrega: Date;

  @Column({ name: 'cantidad_total_pedi' })
  cantidadTotal: number;

  @Column({ name: 'total_pedi', type: 'numeric', precision: 10, scale: 2 })
  total: number;

  @Column({ name: 'estado_pedi', length: 25 })
  estado: string;

  @Column({ name: 'motivo_pedi', length: 250 })
  motivo: string;

  @Column({ name: 'observacion_pedi', length: 250 })
  observacion: string;

  @Column({ name: 'usua_ingre', length: 25, nullable: true })
  usuarioIngreso: string;

  @Column({ name: 'fecha_ingre', nullable: true })
  fechaIngreso: Date;

  @Column({ name: 'usua_actua', length: 25, nullable: true })
  usuarioActualiza: string;

  @Column({ name: 'fecha_actua', nullable: true })
  fechaActualiza: Date;

  @OneToMany(() => DetallePedido, (detalle) => detalle.pedido)
  detalles: DetallePedido[];

  @OneToMany(() => Entrega, (entrega) => entrega.pedido)
  entregas: Entrega[];
}