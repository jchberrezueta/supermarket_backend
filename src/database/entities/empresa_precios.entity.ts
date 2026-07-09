import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EmpresaEntity } from './empresas.entity';
import { ProductoEntity } from './producto.entity';

@Entity({ name: 'empresa_precios' })
export class EmpresaPreciosEntity {
  @PrimaryGeneratedColumn({ name: 'ide_empr_prod' })
  ideEmprProd!: number;

  @Column({ name: 'ide_empr', type: 'int' })
  ideEmpr!: number;

  @Column({ name: 'ide_prod', type: 'int' })
  ideProd!: number;

  @Column({
    name: 'precio_compra_prod',
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  precioCompraProd!: string;

  @Column({
    name: 'dcto_compra_prod',
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  dctoCompraProd!: string;

  @Column({
    name: 'dcto_caducidad_prod',
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  dctoCaducidadProd!: string;

  @Column({
    name: 'iva_prod',
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  ivaProd!: string;

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

  @ManyToOne(() => EmpresaEntity, (empresa) => empresa.preciosProductos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ide_empr' })
  empresa?: EmpresaEntity;

  @ManyToOne(() => ProductoEntity, (producto) => producto.preciosEmpresa, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ide_prod' })
  producto?: ProductoEntity;
}

export { EmpresaPreciosEntity as EmpresaPrecios };
