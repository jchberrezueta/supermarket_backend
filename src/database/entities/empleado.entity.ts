import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RolEntity } from './rol.entity';
import { VentaEntity } from './venta.entity';

@Entity({ name: 'empleado' })
export class EmpleadoEntity {
  @PrimaryGeneratedColumn({ name: 'ide_empl' })
  ideEmpl!: number;

  @Column({ name: 'ide_rol', type: 'int' })
  ideRol!: number;

  @Column({ name: 'cedula_empl', type: 'varchar', length: 15 })
  cedulaEmpl!: string;

  @Column({ name: 'fecha_nacimiento_empl', type: 'date' })
  fechaNacimientoEmpl!: Date;

  @Column({ name: 'edad_empl', type: 'int' })
  edadEmpl!: number;

  @Column({ name: 'fecha_inicio_empl', type: 'date' })
  fechaInicioEmpl!: Date;

  @Column({ name: 'primer_nombre_empl', type: 'varchar', length: 50 })
  primerNombreEmpl!: string;

  @Column({ name: 'apellido_paterno_empl', type: 'varchar', length: 50 })
  apellidoPaternoEmpl!: string;

  @Column({
    name: 'rmu_empl',
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  rmuEmpl!: string;

  @Column({
    name: 'titulo_empl',
    type: 'varchar',
    length: 250,
    default: 'libre',
  })
  tituloEmpl!: string;

  @Column({
    name: 'estado_empl',
    type: 'varchar',
    length: 25,
    default: 'inactivo',
  })
  estadoEmpl!: 'activo' | 'inactivo';

  @Column({
    name: 'segundo_nombre_empl',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  segundoNombreEmpl?: string;

  @Column({
    name: 'apellido_materno_empl',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  apellidoMaternoEmpl?: string;

  @Column({ name: 'fecha_termino_empl', type: 'date', nullable: true })
  fechaTerminoEmpl?: Date;

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

  @ManyToOne(() => RolEntity)
  @JoinColumn({ name: 'ide_rol' })
  rol?: RolEntity;

  @OneToMany(() => VentaEntity, (venta) => venta.empleado)
  ventas?: VentaEntity[];
}

export { EmpleadoEntity as Empleado };
