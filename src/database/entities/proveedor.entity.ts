import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Empresa } from './empresas.entity';
import { Entrega } from './entrega.entity';

@Entity('proveedor')
export class Proveedor {
  @PrimaryGeneratedColumn({ name: 'ide_prov' })
  id: number;

  @ManyToOne(() => Empresa, (empresa) => empresa.proveedores)
  empresa: Empresa;

  @Column({ name: 'cedula_prov', length: 15 })
  cedula: string;

  @Column({ name: 'primer_nombre_prov', length: 50 })
  primerNombre: string;

  @Column({ name: 'segundo_nombre_prov', length: 50 })
  segundoNombre: string;

  @Column({ name: 'apellido_paterno_prov', length: 50 })
  apellidoPaterno: string;

  @Column({ name: 'apellido_materno_prov', length: 50 })
  apellidoMaterno: string;

  @Column({ name: 'fecha_nacimiento_prov' })
  fechaNacimiento: Date;

  @Column({ name: 'edad_prov' })
  edad: number;

  @Column({ name: 'telefono_prov', length: 15 })
  telefono: string;

  @Column({ name: 'email_prov', length: 50 })
  email: string;

  @Column({ name: 'usua_ingre', length: 25, nullable: true })
  usuarioIngreso: string;

  @Column({ name: 'fecha_ingre', nullable: true })
  fechaIngreso: Date;

  @Column({ name: 'usua_actua', length: 25, nullable: true })
  usuarioActualiza: string;

  @Column({ name: 'fecha_actua', nullable: true })
  fechaActualiza: Date;

  @OneToMany(() => Entrega, (entrega) => entrega.proveedor)
  entregas: Entrega[];
}