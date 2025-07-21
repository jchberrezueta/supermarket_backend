import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Producto } from './producto.entity';

@Entity('categoria')
export class Categoria {
  @PrimaryGeneratedColumn({ name: 'ide_cate' })
  id: number;

  @Column({ name: 'nombre_cate', length: 100 })
  nombre: string;

  @Column({ name: 'descripcion_cate', length: 250 })
  descripcion: string;

  @Column({ name: 'usua_ingre', length: 25, nullable: true })
  usuarioIngreso: string;

  @Column({ name: 'fecha_ingre', nullable: true })
  fechaIngreso: Date;

  @Column({ name: 'usua_actua', length: 25, nullable: true })
  usuarioActualiza: string;

  @Column({ name: 'fecha_actua', nullable: true })
  fechaActualiza: Date;

  @OneToMany(() => Producto, (producto) => producto.categoria)
  productos: Producto[];
}