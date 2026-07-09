import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductoEntity } from './producto.entity';

@Entity({ name: 'marca' })
export class MarcaEntity {
  @PrimaryGeneratedColumn({ name: 'ide_marc' })
  ideMarc!: number;

  @Column({ name: 'nombre_marc', type: 'varchar', length: 100 })
  nombreMarc!: string;

  @Column({ name: 'pais_origen_marc', type: 'varchar', length: 100 })
  paisOrigenMarc!: string;

  @Column({ name: 'calidad_marc', type: 'int' })
  calidadMarc!: number;

  @Column({
    name: 'descripcion_marc',
    type: 'varchar',
    length: 250,
    nullable: true,
  })
  descripcionMarc?: string | null;

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

  @OneToMany(() => ProductoEntity, (producto) => producto.marca)
  productos?: ProductoEntity[];
}

export { MarcaEntity as Marca };
