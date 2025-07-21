import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Rol } from './rol.entity';
import { Cuenta } from './cuenta.entity';
import { Venta } from './venta.entity';

@Entity('empleado')
export class Empleado {
  @PrimaryGeneratedColumn({ name: 'ide_empl' })
  id: number;

  @ManyToOne(() => Rol, (rol) => rol.empleados)
  rol: Rol;

  @Column({ name: 'cedula_empl', length: 15 })
  cedula: string;

  @Column({ name: 'primer_nombre_empl', length: 50 })
  primerNombre: string;

  @Column({ name: 'segundo_nombre_empl', length: 50 })
  segundoNombre: string;

  @Column({ name: 'apellido_paterno_empl', length: 50 })
  apellidoPaterno: string;

  @Column({ name: 'apellido_materno_empl', length: 50 })
  apellidoMaterno: string;

  @Column({ name: 'fecha_nacimiento_empl' })
  fechaNacimiento: Date;

  @Column({ name: 'edad_empl' })
  edad: number;

  @Column({ name: 'fecha_inicio_empl' })
  fechaInicio: Date;

  @Column({ name: 'rmu_empl', type: 'numeric', precision: 10, scale: 2 })
  rmu: number;

  @Column({ name: 'fecha_termino_empl', nullable: true })
  fechaTermino: Date;

  @Column({ name: 'usua_ingre', length: 25, nullable: true })
  usuarioIngreso: string;

  @Column({ name: 'fecha_ingre', nullable: true })
  fechaIngreso: Date;

  @Column({ name: 'usua_actua', length: 25, nullable: true })
  usuarioActualiza: string;

  @Column({ name: 'fecha_actua', nullable: true })
  fechaActualiza: Date;

  @OneToMany(() => Cuenta, (cuenta) => cuenta.empleado)
  cuentas: Cuenta[];

  @OneToMany(() => Venta, (venta) => venta.empleado)
  ventas: Venta[];
}