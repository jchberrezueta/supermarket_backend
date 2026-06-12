import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'perfil_opciones' })
export class PerfilOpcionesEntity {
  @PrimaryGeneratedColumn({ name: 'ide_perf_opci' })
  idePerfOpci!: number;

  @Column({ name: 'ide_perf', type: 'int' })
  idePerf!: number;

  @Column({ name: 'ide_opci', type: 'int' })
  ideOpci!: number;

  @Column({ name: 'listar', type: 'varchar', length: 2, default: 'no' })
  listar!: 'si' | 'no';

  @Column({ name: 'insertar', type: 'varchar', length: 2, default: 'no' })
  insertar!: 'si' | 'no';

  @Column({ name: 'modificar', type: 'varchar', length: 2, default: 'no' })
  modificar!: 'si' | 'no';

  @Column({ name: 'eliminar', type: 'varchar', length: 2, default: 'no' })
  eliminar!: 'si' | 'no';

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

export { PerfilOpcionesEntity as PerfilOpciones };
