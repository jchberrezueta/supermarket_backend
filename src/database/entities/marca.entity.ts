import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Producto } from './producto.entity';

@Entity('marca')
export class Marca {
  @PrimaryGeneratedColumn({ name: 'ide_marc' })
  id: number;

  @Column({ name: 'nombre_marc', length: 100 })
  nombre: string;

  @Column({ name: 'pais_origen_marc', length: 100 })
  paisOrigen: string;

  @Column({ name: 'descripcion_marc', length: 250 })
  descripcion: string;

  @Column({ name: 'usua_ingre', length: 25, nullable: true })
  usuarioIngreso: string;

  @Column({ name: 'fecha_ingre', nullable: true })
  fechaIngreso: Date;

  @Column({ name: 'usua_actua', length: 25, nullable: true })
  usuarioActualiza: string;

  @Column({ name: 'fecha_actua', nullable: true })
  fechaActualiza: Date;

  @OneToMany(() => Producto, (producto) => producto.marca)
  productos: Producto[];
}