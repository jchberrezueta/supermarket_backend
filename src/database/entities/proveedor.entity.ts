import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'proveedor' })
export class ProveedorEntity {
  @PrimaryGeneratedColumn({ name: 'ide_prov' })
  ideProv!: number;

  @Column({ name: 'ide_empr', type: 'int' })
  ideEmpr!: number;

  @Column({ name: 'cedula_prov', type: 'varchar', length: 15 })
  cedulaProv!: string;

  @Column({ name: 'fecha_nacimiento_prov', type: 'timestamp' })
  fechaNacimientoProv!: Date;

  @Column({ name: 'edad_prov', type: 'int' })
  edadProv!: number;

  @Column({ name: 'telefono_prov', type: 'varchar', length: 15 })
  telefonoProv!: string;

  @Column({ name: 'email_prov', type: 'varchar', length: 100 })
  emailProv!: string;

  @Column({ name: 'primer_nombre_prov', type: 'varchar', length: 50 })
  primerNombreProv!: string;

  @Column({ name: 'apellido_paterno_prov', type: 'varchar', length: 50 })
  apellidoPaternoProv!: string;

  @Column({
    name: 'segundo_nombre_prov',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  segundoNombreProv?: string;

  @Column({
    name: 'apellido_materno_prov',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  apellidoMaternoProv?: string;

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
}

export { ProveedorEntity as Proveedor };
