import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PerfilOpcionesEntity } from './perfil_opciones.entity';

@Entity({ name: 'opciones' })
export class OpcionesEntity {
  @PrimaryGeneratedColumn({ name: 'ide_opci' })
  ideOpci!: number;

  @Column({ name: 'nombre_opci', type: 'varchar', length: 100 })
  nombreOpci!: string;

  @Column({ name: 'ruta_opci', type: 'varchar', length: 500 })
  rutaOpci!: string;

  @Column({ name: 'activo_opci', type: 'varchar', length: 2 })
  activoOpci!: 'si' | 'no';

  @Column({
    name: 'descripcion_opci',
    type: 'varchar',
    length: 250,
    nullable: true,
  })
  descripcionOpci?: string | null;

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

  @Column({ name: 'nivel_opci', type: 'int' })
  nivelOpci!: number;

  @Column({ name: 'padre_opci', type: 'int', nullable: true })
  padreOpci?: number | null;

  @Column({ name: 'icono_opci', type: 'varchar', length: 50, nullable: true })
  iconoOpci?: string | null;

  @OneToMany(() => PerfilOpcionesEntity, (perfilOpcion) => perfilOpcion.opcion)
  perfilesOpciones?: PerfilOpcionesEntity[];
}

export { OpcionesEntity as Opciones };
