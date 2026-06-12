import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}

export { PerfilEntity as Perfil };
