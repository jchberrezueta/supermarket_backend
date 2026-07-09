import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EmpresaPreciosEntity } from './empresa_precios.entity';
import { PedidoEntity } from './pedido.entity';
import { ProveedorEntity } from './proveedor.entity';

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

  @Column({ name: 'estado_empr', type: 'varchar', length: 25 })
  estadoEmpr!: 'activo' | 'inactivo';

  @Column({
    name: 'descripcion_empr',
    type: 'varchar',
    length: 250,
    nullable: true,
  })
  descripcionEmpr?: string | null;

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

  @OneToMany(() => PedidoEntity, (pedido) => pedido.empresa)
  pedidos?: PedidoEntity[];

  @OneToMany(() => ProveedorEntity, (proveedor) => proveedor.empresa)
  proveedores?: ProveedorEntity[];

  @OneToMany(() => EmpresaPreciosEntity, (precio) => precio.empresa)
  preciosProductos?: EmpresaPreciosEntity[];
}

export { EmpresaEntity as Empresa };
