import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Empresa } from './empresas.entity';
import { Producto } from './producto.entity';

@Entity('empresa_precios')
export class EmpresaPrecios {
  @PrimaryGeneratedColumn({ name: 'ide_empr_prod' })
  id: number;

  @ManyToOne(() => Empresa, (empresa) => empresa.preciosProductos)
  empresa: Empresa;

  @ManyToOne(() => Producto, (producto) => producto.preciosEmpresas)
  producto: Producto;

  @Column({ name: 'precio_compra_prod', type: 'numeric', precision: 10, scale: 2 })
  precioCompra: number;

  @Column({ name: 'dcto_compra_prod', type: 'numeric', precision: 10, scale: 2 })
  descuentoCompra: number;

  @Column({ name: 'iva_prod', type: 'numeric', precision: 10, scale: 2 })
  iva: number;

  @Column({ name: 'dcto_caducidad_prod', type: 'numeric', precision: 10, scale: 2 })
  descuentoCaducidad: number;

  @Column({ name: 'usua_ingre', length: 25, nullable: true })
  usuarioIngreso: string;

  @Column({ name: 'fecha_ingre', nullable: true })
  fechaIngreso: Date;

  @Column({ name: 'usua_actua', length: 25, nullable: true })
  usuarioActualiza: string;

  @Column({ name: 'fecha_actua', nullable: true })
  fechaActualiza: Date;
}