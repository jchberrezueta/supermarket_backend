import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Rol } from './rol.entity';
import { Cuenta } from './cuenta.entity';
import { PerfilOpciones } from './perfil_opciones.entity';

@Entity('perfil')
export class Perfil {
  @PrimaryGeneratedColumn({ name: 'ide_perf' })
  id: number;

  @ManyToOne(() => Rol, (rol) => rol.perfiles)
  rol: Rol;

  @Column({ name: 'nombre_perf', length: 1000 })
  nombre: string;

  @Column({ name: 'descripcion_perf', length: 1000 })
  descripcion: string;

  @Column({ name: 'usua_ingre', length: 25, nullable: true })
  usuarioIngreso: string;

  @Column({ name: 'fecha_ingre', nullable: true })
  fechaIngreso: Date;

  @Column({ name: 'usua_actua', length: 25, nullable: true })
  usuarioActualiza: string;

  @Column({ name: 'fecha_actua', nullable: true })
  fechaActualiza: Date;

  @OneToMany(() => Cuenta, (cuenta) => cuenta.perfil)
  cuentas: Cuenta[];

  @OneToMany(() => PerfilOpciones, (perfilOpcion) => perfilOpcion.perfil)
  opciones: PerfilOpciones[];
}