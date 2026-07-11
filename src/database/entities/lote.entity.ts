import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DetalleEntregaLoteEntity } from './detalle_entrega_lote.entity';
import { MovimientoInventarioEntity } from './movimiento_inventario.entity';
import { ProductoEntity } from './producto.entity';

export type EstadoLote = 'correcto' | 'proximo' | 'caducado' | 'devuelto';

@Entity({ name: 'lote' })
export class LoteEntity {
  @PrimaryGeneratedColumn({ name: 'ide_lote' })
  ideLote!: number;

  @Column({ name: 'ide_prod', type: 'int' })
  ideProd!: number;

  @Column({ name: 'fecha_caducidad_lote', type: 'date' })
  fechaCaducidadLote!: Date;

  @Column({ name: 'stock_lote', type: 'int' })
  stockLote!: number;

  @Column({ name: 'estado_lote', type: 'varchar', length: 25 })
  estadoLote!: EstadoLote;

  @ManyToOne(() => ProductoEntity, (producto) => producto.lotes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ide_prod' })
  producto?: ProductoEntity;

  @OneToMany(() => DetalleEntregaLoteEntity, (detalle) => detalle.lote)
  detallesEntregaLote?: DetalleEntregaLoteEntity[];

  @OneToMany(() => MovimientoInventarioEntity, (movimiento) => movimiento.lote)
  movimientosInventario?: MovimientoInventarioEntity[];
}

export { LoteEntity as Lote };
