import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OpcionesEntity } from './opciones.entity';
import { PerfilEntity } from './perfil.entity';

@Entity({ name: 'perfil_opciones' })
export class PerfilOpcionesEntity {
  @PrimaryGeneratedColumn({ name: 'ide_perf_opci' })
  idePerfOpci!: number;

  @Column({ name: 'ide_perf', type: 'int' })
  idePerf!: number;

  @Column({ name: 'ide_opci', type: 'int' })
  ideOpci!: number;

  @Column({ name: 'listar', type: 'varchar', length: 2 })
  listar!: 'si' | 'no';

  @Column({ name: 'insertar', type: 'varchar', length: 2 })
  insertar!: 'si' | 'no';

  @Column({ name: 'modificar', type: 'varchar', length: 2 })
  modificar!: 'si' | 'no';

  @Column({ name: 'eliminar', type: 'varchar', length: 2 })
  eliminar!: 'si' | 'no';

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

  @ManyToOne(() => PerfilEntity, (perfil) => perfil.perfilesOpciones, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ide_perf' })
  perfil?: PerfilEntity;

  @ManyToOne(() => OpcionesEntity, (opcion) => opcion.perfilesOpciones, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ide_opci' })
  opcion?: OpcionesEntity;
}

export { PerfilOpcionesEntity as PerfilOpciones };
