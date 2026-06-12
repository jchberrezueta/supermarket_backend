import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'empresa' })
export class EmpresaEntity {
  @PrimaryGeneratedColumn({ name: 'ide_empr' })
  ideEmpr!: number;

  @Column({ name: 'nombre_empr', type: 'varchar', length: 250 })
  nombreEmpr!: string;

  @Column({ name: 'responsable_empr', type: 'varchar', length: 250 })
  responsableEmpr!: string;

  @Column({ name: 'fecha_contrato_empr', type: 'timestamp' })
  fechaContratoEmpr!: Date;

  @Column({ name: 'direccion_empr', type: 'varchar', length: 250 })
  direccionEmpr!: string;

  @Column({ name: 'telefono_empr', type: 'varchar', length: 15 })
  telefonoEmpr!: string;

  @Column({ name: 'email_empr', type: 'varchar', length: 100 })
  emailEmpr!: string;

  @Column({
    name: 'estado_empr',
    type: 'varchar',
    length: 25,
    default: 'inactivo',
  })
  estadoEmpr!: 'activo' | 'inactivo';

  @Column({
    name: 'descripcion_empr',
    type: 'varchar',
    length: 250,
    default: 'Ninguna',
  })
  descripcionEmpr!: string;

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

export { EmpresaEntity as Empresa };
