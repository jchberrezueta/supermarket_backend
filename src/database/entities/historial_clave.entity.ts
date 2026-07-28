import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CuentaEntity } from './cuenta.entity';

@Entity({ name: 'historial_clave' })
@Index('idx_historial_clave_cuenta_fecha', ['ideCuen', 'fechaIngre'])
export class HistorialClaveEntity {
  @PrimaryGeneratedColumn({
    name: 'ide_hclav',
  })
  ideHclav!: number;

  @Column({
    name: 'ide_cuen',
    type: 'int',
  })
  ideCuen!: number;

  @Column({
    name: 'password_hash',
    type: 'varchar',
    length: 250,
  })
  passwordHash!: string;

  @Column({
    name: 'usua_ingre',
    type: 'varchar',
    length: 25,
  })
  usuaIngre!: string;

  @Column({
    name: 'fecha_ingre',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaIngre!: Date;

  @ManyToOne(() => CuentaEntity, (cuenta) => cuenta.historialClaves, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'ide_cuen',
  })
  cuenta?: CuentaEntity;
}
