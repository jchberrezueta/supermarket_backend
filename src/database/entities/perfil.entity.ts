import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PerfilOpcionesEntity } from './perfil_opciones.entity';
import { RolEntity } from './rol.entity';

@Entity({ name: 'perfil' })
export class PerfilEntity {
  @PrimaryGeneratedColumn({ name: 'ide_perf' })
  idePerf!: number;

  @Column({ name: 'ide_rol', type: 'int' })
  ideRol!: number;

  @Column({ name: 'nombre_perf', type: 'varchar', length: 100 })
  nombrePerf!: string;

  @Column({
    name: 'descripcion_perf',
    type: 'varchar',
    length: 250,
    default: 'Ninguna',
  })
  descripcionPerf!: string;

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

  @ManyToOne(() => RolEntity, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'ide_rol' })
  rol?: RolEntity;

  @OneToMany(() => PerfilOpcionesEntity, (perfilOpcion) => perfilOpcion.perfil)
  perfilesOpciones?: PerfilOpcionesEntity[];
}

export { PerfilEntity as Perfil };
