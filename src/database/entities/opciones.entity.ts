import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PerfilOpciones } from './perfil_opciones.entity';

@Entity('opciones')
export class Opciones {
  @PrimaryGeneratedColumn({ name: 'ide_opci' })
  id: number;

  @Column({ name: 'nombre_opci', length: 500 })
  nombre: string;

  @Column({ name: 'ruta_opci', length: 500 })
  ruta: string;

  @Column({ name: 'activo_opci', length: 2 })
  activo: string;

  @Column({ name: 'descripcion_opci', length: 1000 })
  descripcion: string;

  @Column({ name: 'usua_ingre', length: 25, nullable: true })
  usuarioIngreso: string;

  @Column({ name: 'fecha_ingre', nullable: true })
  fechaIngreso: Date;

  @Column({ name: 'usua_actua', length: 25, nullable: true })
  usuarioActualiza: string;

  @Column({ name: 'fecha_actua', nullable: true })
  fechaActualiza: Date;

  @OneToMany(() => PerfilOpciones, (perfilOpcion) => perfilOpcion.opcion)
  perfiles: PerfilOpciones[];
}