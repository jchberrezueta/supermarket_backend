import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductoEntity } from './producto.entity';

@Entity({ name: 'lote' })
export class LoteEntity {
  @PrimaryGeneratedColumn({ name: 'ide_lote' })
  ideLote!: number;

  @Column({ name: 'ide_prod', type: 'int' })
  ideProd!: number;

  @Column({ name: 'fecha_caducidad_lote', type: 'date' })
  fechaCaducidadLote!: Date;

  @Column({ name: 'stock_lote', type: 'int', default: 0 })
  stockLote!: number;

  @Column({
    name: 'estado_lote',
    type: 'varchar',
    length: 25,
    default: 'correcto',
  })
  estadoLote!: 'correcto' | 'proximo' | 'caducado' | 'devuelto';

  @ManyToOne(() => ProductoEntity, (producto) => producto.lotes, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'ide_prod' })
  producto?: ProductoEntity;
}

export { LoteEntity as Lote };
