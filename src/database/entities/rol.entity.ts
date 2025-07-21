import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Empleado } from './empleado.entity';
import { Perfil } from './perfil.entity';

@Entity('rol')
export class Rol {
  @PrimaryGeneratedColumn({ name: 'ide_rol' })
  id: number;

  @Column({ name: 'nombre_rol', length: 250 })
  nombre: string;

  @Column({ name: 'descripcion_rol', length: 250 })
  descripcion: string;

  @Column({ name: 'usua_ingre', length: 25, nullable: true })
  usuarioIngreso: string;

  @Column({ name: 'fecha_ingre', nullable: true })
  fechaIngreso: Date;

  @Column({ name: 'usua_actua', length: 25, nullable: true })
  usuarioActualiza: string;

  @Column({ name: 'fecha_actua', nullable: true })
  fechaActualiza: Date;

  @OneToMany(() => Empleado, (empleado) => empleado.rol)
  empleados: Empleado[];

  @OneToMany(() => Perfil, (perfil) => perfil.rol)
  perfiles: Perfil[];
}