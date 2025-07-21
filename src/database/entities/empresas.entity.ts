import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Proveedor } from './proveedor.entity';
import { Pedido } from './pedido.entity';
import { EmpresaPrecios } from './empresa_precios.entity';

@Entity('empresa')
export class Empresa {
  @PrimaryGeneratedColumn({ name: 'ide_empr' })
  id: number;

  @Column({ name: 'nombre_empr', length: 500 })
  nombre: string;

  @Column({ name: 'responsable_empr', length: 250 })
  responsable: string;

  @Column({ name: 'direccion_empr', length: 1000 })
  direccion: string;

  @Column({ name: 'telefono_empr', length: 15 })
  telefono: string;

  @Column({ name: 'email_empr', length: 50 })
  email: string;

  @Column({ name: 'fecha_contrato_empr' })
  fechaContrato: Date;

  @Column({ name: 'estado_empr', length: 25 })
  estado: string;

  @Column({ name: 'usua_ingre', length: 25, nullable: true })
  usuarioIngreso: string;

  @Column({ name: 'fecha_ingre', nullable: true })
  fechaIngreso: Date;

  @Column({ name: 'usua_actua', length: 25, nullable: true })
  usuarioActualiza: string;

  @Column({ name: 'fecha_actua', nullable: true })
  fechaActualiza: Date;

  @OneToMany(() => Proveedor, (proveedor) => proveedor.empresa)
  proveedores: Proveedor[];

  @OneToMany(() => Pedido, (pedido) => pedido.empresa)
  pedidos: Pedido[];

  @OneToMany(() => EmpresaPrecios, (empresaPrecio) => empresaPrecio.empresa)
  preciosProductos: EmpresaPrecios[];
}