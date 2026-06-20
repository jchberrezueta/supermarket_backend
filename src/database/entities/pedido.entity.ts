import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DetallePedidoEntity } from './detalle_pedido.entity';
import { EmpresaEntity } from './empresas.entity';
import { EntregaEntity } from './entrega.entity';

@Entity({ name: 'pedido' })
export class PedidoEntity {
  @PrimaryGeneratedColumn({ name: 'ide_pedi' })
  idePedi!: number;

  @Column({ name: 'ide_empr', type: 'int' })
  ideEmpr!: number;

  @Column({ name: 'fecha_pedi', type: 'timestamp' })
  fechaPedi!: Date;

  @Column({ name: 'fecha_entr_pedi', type: 'timestamp' })
  fechaEntrPedi!: Date;

  @Column({ name: 'cantidad_total_pedi', type: 'int' })
  cantidadTotalPedi!: number;

  @Column({
    name: 'total_pedi',
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  totalPedi!: string;

  @Column({
    name: 'estado_pedi',
    type: 'varchar',
    length: 25,
    default: 'progreso',
  })
  estadoPedi!: 'progreso' | 'completado' | 'incompleto' | 'emitido';

  @Column({
    name: 'motivo_pedi',
    type: 'varchar',
    length: 25,
    default: 'peticion',
  })
  motivoPedi!: 'peticion' | 'devolucion';

  @Column({
    name: 'observacion_pedi',
    type: 'varchar',
    length: 250,
    default: 'Ninguna',
  })
  observacionPedi!: string;

  @Column({ name: 'usua_ingre', type: 'varchar', length: 25, nullable: true })
  usuaIngre?: string;

  @Column({
    name: 'fecha_ingre',
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaIngre?: Date;

  @Column({ name: 'usua_actua', type: 'varchar', length: 25, nullable: true })
  usuaActua?: string;

  @Column({ name: 'fecha_actua', type: 'timestamp', nullable: true })
  fechaActua?: Date;

  @ManyToOne(() => EmpresaEntity, (empresa) => empresa.pedidos)
  @JoinColumn({ name: 'ide_empr' })
  empresa?: EmpresaEntity;

  @OneToMany(() => DetallePedidoEntity, (detalle) => detalle.pedido)
  detalles?: DetallePedidoEntity[];

  @OneToMany(() => EntregaEntity, (entrega) => entrega.pedido)
  entregas?: EntregaEntity[];
}

export { PedidoEntity as Pedido };
