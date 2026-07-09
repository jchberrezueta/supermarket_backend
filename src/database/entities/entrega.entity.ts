import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DetalleEntregaEntity } from './detalle_entrega.entity';
import { PedidoEntity } from './pedido.entity';
import { ProveedorEntity } from './proveedor.entity';

@Entity({ name: 'entrega' })
export class EntregaEntity {
  @PrimaryGeneratedColumn({ name: 'ide_entr' })
  ideEntr!: number;

  @Column({ name: 'ide_pedi', type: 'int' })
  idePedi!: number;

  @Column({ name: 'ide_prov', type: 'int' })
  ideProv!: number;

  @Column({ name: 'fecha_entr', type: 'timestamp' })
  fechaEntr!: Date;

  @Column({ name: 'cantidad_total_entr', type: 'int' })
  cantidadTotalEntr!: number;

  @Column({
    name: 'total_entr',
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  totalEntr!: string;

  @Column({ name: 'estado_entr', type: 'varchar', length: 25 })
  estadoEntr!: 'completo' | 'incompleto';

  @Column({
    name: 'observacion_entr',
    type: 'varchar',
    length: 250,
    nullable: true,
  })
  observacionEntr?: string | null;

  @Column({ name: 'usua_ingre', type: 'varchar', length: 25 })
  usuaIngre!: string;

  @Column({
    name: 'fecha_ingre',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaIngre!: Date;

  @Column({ name: 'usua_actua', type: 'varchar', length: 25, nullable: true })
  usuaActua?: string | null;

  @Column({ name: 'fecha_actua', type: 'timestamp', nullable: true })
  fechaActua?: Date | null;

  @ManyToOne(() => PedidoEntity, (pedido) => pedido.entregas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ide_pedi' })
  pedido?: PedidoEntity;

  @ManyToOne(() => ProveedorEntity, (proveedor) => proveedor.entregas, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'ide_prov' })
  proveedor?: ProveedorEntity;

  @OneToMany(() => DetalleEntregaEntity, (detalle) => detalle.entrega)
  detalles?: DetalleEntregaEntity[];
}

export { EntregaEntity as Entrega };
