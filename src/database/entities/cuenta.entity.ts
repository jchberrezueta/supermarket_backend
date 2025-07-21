import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Empleado } from './empleado.entity';
import { Perfil } from './perfil.entity';
import { AccesoUsuario } from './acceso_usuario.entity';

@Entity('cuenta')
export class Cuenta {
  @PrimaryGeneratedColumn({ name: 'ide_cuen' })
  id: number;

  @ManyToOne(() => Empleado, (empleado) => empleado.cuentas)
  empleado: Empleado;

  @ManyToOne(() => Perfil, (perfil) => perfil.cuentas)
  perfil: Perfil;

  @Column({ name: 'usuario_cuen', length: 25 })
  usuario: string;

  @Column({ name: 'password_cuen', length: 25 })
  password: string;

  @Column({ name: 'estado_cuen', length: 25 })
  estado: string;

  @Column({ name: 'usua_ingre', length: 25, nullable: true })
  usuarioIngreso: string;

  @Column({ name: 'fecha_ingre', nullable: true })
  fechaIngreso: Date;

  @Column({ name: 'usua_actua', length: 25, nullable: true })
  usuarioActualiza: string;

  @Column({ name: 'fecha_actua', nullable: true })
  fechaActualiza: Date;

  @OneToMany(() => AccesoUsuario, (acceso) => acceso.cuenta)
  accesos: AccesoUsuario[];
}