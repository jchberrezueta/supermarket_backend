import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Cliente } from './cliente.entity';
import { Empleado } from './empleado.entity';
import { DetalleVenta } from './detalle_venta.entity';

@Entity('venta')
export class Venta {
  @PrimaryGeneratedColumn({ name: 'ide_vent' })
  id: number;

  @ManyToOne(() => Cliente, (cliente) => cliente.ventas)
  cliente: Cliente;

  @ManyToOne(() => Empleado, (empleado) => empleado.ventas)
  empleado: Empleado;

  @Column({ name: 'num_factura_vent', length: 25 })
  numeroFactura: string;

  @Column({ name: 'fecha_vent' })
  fecha: Date;

  @Column({ name: 'sub_total_vent', type: 'numeric', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ name: 'dcto_vent', type: 'numeric', precision: 10, scale: 2 })
  descuento: number;

  @Column({ name: 'total_vent', type: 'numeric', precision: 10, scale: 2 })
  total: number;

  @Column({ name: 'estado_vent', length: 25 })
  estado: string;

  @Column({ name: 'usua_ingre', length: 25, nullable: true })
  usuarioIngreso: string;

  @Column({ name: 'fecha_ingre', nullable: true })
  fechaIngreso: Date;

  @Column({ name: 'usua_actua', length: 25, nullable: true })
  usuarioActualiza: string;

  @Column({ name: 'fecha_actua', nullable: true })
  fechaActualiza: Date;

  @OneToMany(() => DetalleVenta, (detalle) => detalle.venta)
  detalles: DetalleVenta[];
}