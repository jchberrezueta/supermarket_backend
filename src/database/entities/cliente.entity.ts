import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Venta } from './venta.entity';

@Entity('cliente')
export class Cliente {
  @PrimaryGeneratedColumn({ name: 'ide_clie' })
  id: number;

  @Column({ name: 'cedula_clie', length: 15 })
  cedula: string;

  @Column({ name: 'primer_nombre_clie', length: 50 })
  primerNombre: string;

  @Column({ name: 'segundo_nombre_clie', length: 50 })
  segundoNombre: string;

  @Column({ name: 'apellido_paterno_clie', length: 50 })
  apellidoPaterno: string;

  @Column({ name: 'apellido_materno_clie', length: 50 })
  apellidoMaterno: string;

  @Column({ name: 'fecha_nacimiento_clie' })
  fechaNacimiento: Date;

  @Column({ name: 'edad_clie' })
  edad: number;

  @Column({ name: 'telefono_clie', length: 15 })
  telefono: string;

  @Column({ name: 'email_clie', length: 50 })
  email: string;

  @Column({ name: 'es_socio', length: 2 })
  esSocio: string;

  @Column({ name: 'es_tercera_edad', length: 2 })
  esTerceraEdad: string;

  @Column({ name: 'usua_ingre', length: 25, nullable: true })
  usuarioIngreso: string;

  @Column({ name: 'fecha_ingre', nullable: true })
  fechaIngreso: Date;

  @Column({ name: 'usua_actua', length: 15, nullable: true })
  usuarioActualiza: string;

  @Column({ name: 'fecha_actua', nullable: true })
  fechaActualiza: Date;

  @OneToMany(() => Venta, (venta) => venta.cliente)
  ventas: Venta[];
}