import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Perfil } from './perfil.entity';
import { Opciones } from './opciones.entity';

@Entity('perfil_opciones')
export class PerfilOpciones {
  @PrimaryGeneratedColumn({ name: 'ide_perf_opci' })
  id: number;

  @ManyToOne(() => Perfil, (perfil) => perfil.opciones)
  perfil: Perfil;

  @ManyToOne(() => Opciones, (opcion) => opcion.perfiles)
  opcion: Opciones;

  @Column({ name: 'listar', length: 2 })
  listar: string;

  @Column({ name: 'insertar', length: 2 })
  insertar: string;

  @Column({ name: 'modificar', length: 2 })
  modificar: string;

  @Column({ name: 'eliminar', length: 2 })
  eliminar: string;

  @Column({ name: 'usua_ingre', length: 25, nullable: true })
  usuarioIngreso: string;

  @Column({ name: 'fecha_ingre', nullable: true })
  fechaIngreso: Date;

  @Column({ name: 'usua_actua', length: 25, nullable: true })
  usuarioActualiza: string;

  @Column({ name: 'fecha_actua', nullable: true })
  fechaActualiza: Date;
}