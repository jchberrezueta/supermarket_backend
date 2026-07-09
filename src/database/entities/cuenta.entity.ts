import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AccesoUsuarioEntity } from './acceso_usuario.entity';
import { EmpleadoEntity } from './empleado.entity';
import { PerfilEntity } from './perfil.entity';

@Entity({ name: 'cuenta' })
@Index('cuenta_usuario_cuen_key', ['usuarioCuen'], { unique: true })
export class CuentaEntity {
  @PrimaryGeneratedColumn({ name: 'ide_cuen' })
  ideCuen!: number;

  @Column({ name: 'ide_empl', type: 'int' })
  ideEmpl!: number;

  @Column({ name: 'ide_perf', type: 'int' })
  idePerf!: number;

  @Column({ name: 'usuario_cuen', type: 'varchar', length: 25 })
  usuarioCuen!: string;

  @Column({ name: 'password_cuen', type: 'varchar', length: 250 })
  passwordCuen!: string;

  @Column({ name: 'estado_cuen', type: 'varchar', length: 25 })
  estadoCuen!: 'activo' | 'inactivo' | 'bloqueado';

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

  @ManyToOne(() => EmpleadoEntity, (empleado) => empleado.cuentas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ide_empl' })
  empleado?: EmpleadoEntity;

  @ManyToOne(() => PerfilEntity, (perfil) => perfil.cuentas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ide_perf' })
  perfil?: PerfilEntity;

  @OneToMany(() => AccesoUsuarioEntity, (acceso) => acceso.cuenta)
  accesos?: AccesoUsuarioEntity[];
}

export { CuentaEntity as Cuenta };
