import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
    default: 'Ninguna',
  })
  descripcionCate!: string;

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
}

export { CategoriaEntity as Categoria };
