import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'rol' })
export class RolEntity {
  @PrimaryGeneratedColumn({ name: 'ide_rol' })
  ideRol!: number;

  @Column({ name: 'nombre_rol', type: 'varchar', length: 100 })
  nombreRol!: string;

  @Column({
    name: 'descripcion_rol',
    type: 'varchar',
    length: 250,
    default: 'Ninguna',
  })
  descripcionRol!: string;

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

export { RolEntity as Rol };
