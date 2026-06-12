import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'producto' })
export class ProductoEntity {
  @PrimaryGeneratedColumn({ name: 'ide_prod' })
  ideProd!: number;

  @Column({ name: 'ide_cate', type: 'int' })
  ideCate!: number;

  @Column({ name: 'ide_marc', type: 'int' })
  ideMarc!: number;

  @Column({ name: 'codigo_barra_prod', type: 'varchar', length: 30 })
  codigoBarraProd!: string;

  @Column({ name: 'nombre_prod', type: 'varchar', length: 100 })
  nombreProd!: string;

  @Column({
    name: 'precio_venta_prod',
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  precioVentaProd!: string;

  @Column({
    name: 'iva_prod',
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  ivaProd!: string;

  @Column({
    name: 'dcto_promo_prod',
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  dctoPromoProd!: string;

  @Column({ name: 'stock_prod', type: 'int', default: 0 })
  stockProd!: number;

  @Column({
    name: 'disponible_prod',
    type: 'varchar',
    length: 25,
    default: 'no',
  })
  disponibleProd!: 'si' | 'no';

  @Column({
    name: 'estado_prod',
    type: 'varchar',
    length: 25,
    default: 'inactivo',
  })
  estadoProd!: 'activo' | 'inactivo';

  @Column({
    name: 'descripcion_prod',
    type: 'varchar',
    length: 250,
    default: 'Ninguna',
  })
  descripcionProd!: string;

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

  @Column({ name: 'url_img_prod', type: 'varchar', length: 500 })
  urlImgProd!: string;
}

export { ProductoEntity as Producto };
