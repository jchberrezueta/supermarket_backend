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

export type EstadoPedido =
  | 'borrador'
  | 'emitido'
  | 'parcial'
  | 'completado'
  | 'cerrado_incompleto'
  | 'cancelado';

export type MotivoPedido = 'peticion' | 'devolucion';

@Entity({ name: 'pedido' })
export class PedidoEntity {
  @PrimaryGeneratedColumn({ name: 'ide_pedi' })
  idePedi!: number;

  @Column({ name: 'ide_empr', type: 'int' })
  ideEmpr!: number;

  @Column({ name: 'fecha_pedi', type: 'timestamp' })
  fechaPedi!: Date;

  @Column({ name: 'fecha_entr_pedi', type: 'timestamp', nullable: true })
  fechaEntrPedi!: Date | null;

  @Column({ name: 'cantidad_total_pedi', type: 'int' })
  cantidadTotalPedi!: number;

  @Column({
    name: 'total_pedi',
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  totalPedi!: string;

  @Column({ name: 'estado_pedi', type: 'varchar', length: 25 })
  estadoPedi!: EstadoPedido;

  @Column({ name: 'motivo_pedi', type: 'varchar', length: 25 })
  motivoPedi!: MotivoPedido;

  @Column({
    name: 'observacion_pedi',
    type: 'varchar',
    length: 250,
    nullable: true,
  })
  observacionPedi?: string | null;

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

  @ManyToOne(() => EmpresaEntity, (empresa) => empresa.pedidos, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'ide_empr' })
  empresa?: EmpresaEntity;

  @OneToMany(() => DetallePedidoEntity, (detalle) => detalle.pedido)
  detalles?: DetallePedidoEntity[];

  @OneToMany(() => EntregaEntity, (entrega) => entrega.pedido)
  entregas?: EntregaEntity[];
}

export { PedidoEntity as Pedido };
