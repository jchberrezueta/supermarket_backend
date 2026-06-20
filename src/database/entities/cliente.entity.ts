import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { VentaEntity } from './venta.entity';

@Entity({ name: 'cliente' })
export class ClienteEntity {
  @PrimaryGeneratedColumn({ name: 'ide_clie' })
  ideClie!: number;

  @Column({ name: 'cedula_clie', type: 'varchar', length: 15 })
  cedulaClie!: string;

  @Column({ name: 'fecha_nacimiento_clie', type: 'date' })
  fechaNacimientoClie!: Date;

  @Column({ name: 'edad_clie', type: 'int' })
  edadClie!: number;

  @Column({ name: 'telefono_clie', type: 'varchar', length: 15 })
  telefonoClie!: string;

  @Column({ name: 'primer_nombre_clie', type: 'varchar', length: 50 })
  primerNombreClie!: string;

  @Column({ name: 'apellido_paterno_clie', type: 'varchar', length: 50 })
  apellidoPaternoClie!: string;

  @Column({
    name: 'email_clie',
    type: 'varchar',
    length: 100,
    default: 'Ninguno',
  })
  emailClie!: string;

  @Column({ name: 'es_socio', type: 'varchar', length: 2, default: 'no' })
  esSocio!: 'si' | 'no';

  @Column({
    name: 'es_tercera_edad',
    type: 'varchar',
    length: 2,
    default: 'no',
  })
  esTerceraEdad!: 'si' | 'no';

  @Column({
    name: 'segundo_nombre_clie',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  segundoNombreClie?: string;

  @Column({
    name: 'apellido_materno_clie',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  apellidoMaternoClie?: string;

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

  @OneToMany(() => VentaEntity, (venta) => venta.cliente)
  ventas?: VentaEntity[];
}

export { ClienteEntity as Cliente };
