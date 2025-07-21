import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Producto } from './producto.entity';

@Entity('lote')
export class Lote {
  @PrimaryGeneratedColumn({ name: 'ide_lote' })
  id: number;

  @ManyToOne(() => Producto, (producto) => producto.lotes)
  producto: Producto;

  @Column({ name: 'stock_lote' })
  stock: number;

  @Column({ name: 'estado_lote', length: 100 })
  estado: string;

  @Column({ name: 'fecha_caducidad_lote' })
  fechaCaducidad: Date;
}