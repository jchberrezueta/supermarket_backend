import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
    default: 0,
  })
  precioCompraProd!: string;

  @Column({
    name: 'dcto_compra_prod',
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  dctoCompraProd!: string;

  @Column({
    name: 'dcto_caducidad_prod',
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  dctoCaducidadProd!: string;

  @Column({
    name: 'iva_prod',
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  ivaProd!: string;

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

export { EmpresaPreciosEntity as EmpresaPrecios };
