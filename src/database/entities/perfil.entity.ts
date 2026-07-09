import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CuentaEntity } from './cuenta.entity';
import { PerfilOpcionesEntity } from './perfil_opciones.entity';
import { RolEntity } from './rol.entity';

@Entity({ name: 'perfil' })
@Index('perfil_nombre_perf_unique', ['nombrePerf'], { unique: true })
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
    nullable: true,
  })
  descripcionPerf?: string | null;

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

  @ManyToOne(() => RolEntity, (rol) => rol.perfiles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ide_rol' })
  rol?: RolEntity;

  @OneToMany(() => PerfilOpcionesEntity, (perfilOpcion) => perfilOpcion.perfil)
  perfilesOpciones?: PerfilOpcionesEntity[];

  @OneToMany(() => CuentaEntity, (cuenta) => cuenta.perfil)
  cuentas?: CuentaEntity[];
}

export { PerfilEntity as Perfil };
