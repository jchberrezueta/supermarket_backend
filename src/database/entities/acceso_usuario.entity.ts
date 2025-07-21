import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Cuenta } from './cuenta.entity';

@Entity('acceso_usuario')
export class AccesoUsuario {
  @PrimaryGeneratedColumn({ name: 'ide_acce' })
  id: number;

  @ManyToOne(() => Cuenta, (cuenta) => cuenta.accesos)
  cuenta: Cuenta;

  @Column({ name: 'fecha_acce' })
  fecha: Date;

  @Column({ name: 'num_intentos_acce' })
  intentos: number;

  @Column({ name: 'ip_acce', length: 50 })
  ip: string;

  @Column({ name: 'navegador_acce', length: 250 })
  navegador: string;

  @Column({ name: 'latitud_acce', nullable: true })
  latitud: number;

  @Column({ name: 'longitud_acce', nullable: true })
  longitud: number;
}