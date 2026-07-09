import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EmpleadoEntity } from './empleado.entity';
import { PerfilEntity } from './perfil.entity';

@Entity({ name: 'rol' })
@Index('rol_nombre_rol_unique', ['nombreRol'], { unique: true })
export class RolEntity {
  @PrimaryGeneratedColumn({ name: 'ide_rol' })
  ideRol!: number;

  @Column({ name: 'nombre_rol', type: 'varchar', length: 100 })
  nombreRol!: string;

  @Column({
    name: 'descripcion_rol',
    type: 'varchar',
    length: 250,
    nullable: true,
  })
  descripcionRol?: string | null;

  @Column({ name: 'usua_ingre', type: 'varchar', length: 25 })
  usuaIngre!: string;

  @Column({
    name: 'fecha_ingre',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaIngre!: Date;

  @Column({ name: 'usua_actua', type: 'varchar', length: 25, nullable: true })
  usuaActua?: string | null;

  @Column({ name: 'fecha_actua', type: 'timestamp', nullable: true })
  fechaActua?: Date | null;

  @OneToMany(() => EmpleadoEntity, (empleado) => empleado.rol)
  empleados?: EmpleadoEntity[];

  @OneToMany(() => PerfilEntity, (perfil) => perfil.rol)
  perfiles?: PerfilEntity[];
}

export { RolEntity as Rol };
