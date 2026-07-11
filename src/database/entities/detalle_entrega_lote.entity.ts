import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DetalleEntregaEntity } from './detalle_entrega.entity';
import { LoteEntity } from './lote.entity';

export type EstadoDetalleEntregaLote = 'registrado' | 'confirmado' | 'anulado';

@Entity({ name: 'detalle_entrega_lote' })
export class DetalleEntregaLoteEntity {
  @PrimaryGeneratedColumn({ name: 'ide_deta_entr_lote' })
  ideDetaEntrLote!: number;

  @Column({ name: 'ide_deta_entr', type: 'int' })
  ideDetaEntr!: number;

  @Column({ name: 'ide_lote', type: 'int', nullable: true })
  ideLote?: number | null;

  @Column({ name: 'fecha_caducidad_lote', type: 'date' })
  fechaCaducidadLote!: Date;

  @Column({ name: 'cantidad_lote', type: 'int' })
  cantidadLote!: number;

  @Column({
    name: 'estado_deta_entr_lote',
    type: 'varchar',
    length: 25,
    default: 'registrado',
  })
  estadoDetaEntrLote!: EstadoDetalleEntregaLote;

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

  @ManyToOne(() => DetalleEntregaEntity, (detalle) => detalle.lotesRecibidos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ide_deta_entr' })
  detalleEntrega?: DetalleEntregaEntity;

  @ManyToOne(() => LoteEntity, (lote) => lote.detallesEntregaLote, {
    nullable: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'ide_lote' })
  lote?: LoteEntity | null;
}

export { DetalleEntregaLoteEntity as DetalleEntregaLote };
