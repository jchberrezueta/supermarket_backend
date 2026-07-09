import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductoEntity } from './producto.entity';

@Entity({ name: 'categoria' })
export class CategoriaEntity {
  @PrimaryGeneratedColumn({ name: 'ide_cate' })
  ideCate!: number;

  @Column({ name: 'nombre_cate', type: 'varchar', length: 100 })
  nombreCate!: string;

  @Column({
    name: 'descripcion_cate',
    type: 'varchar',
    length: 250,
    nullable: true,
  })
  descripcionCate?: string | null;

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

  @OneToMany(() => ProductoEntity, (producto) => producto.categoria)
  productos?: ProductoEntity[];
}

export { CategoriaEntity as Categoria };
