import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DetalleEntregaEntity } from './detalle_entrega.entity';
import { DetalleVentaEntity } from './detalle_venta.entity';
import { LoteEntity } from './lote.entity';
import { ProductoEntity } from './producto.entity';

export type TipoMovimientoInventario =
  | 'entrada_entrega'
  | 'salida_venta'
  | 'salida_devolucion_proveedor'
  | 'entrada_canje_caducidad'
  | 'anulacion_venta'
  | 'anulacion_entrega'
  | 'ajuste_entrada'
  | 'ajuste_salida'
  | 'correccion_lote';

@Entity({ name: 'movimiento_inventario' })
export class MovimientoInventarioEntity {
  @PrimaryGeneratedColumn({ name: 'ide_movi' })
  ideMovi!: number;

  @Column({ name: 'ide_prod', type: 'int' })
  ideProd!: number;

  @Column({ name: 'ide_lote', type: 'int', nullable: true })
  ideLote?: number | null;

  @Column({ name: 'ide_deta_entr', type: 'int', nullable: true })
  ideDetaEntr?: number | null;

  @Column({ name: 'ide_deta_vent', type: 'int', nullable: true })
  ideDetaVent?: number | null;

  @Column({ name: 'tipo_movi', type: 'varchar', length: 50 })
  tipoMovi!: TipoMovimientoInventario;

  @Column({ name: 'cantidad_movi', type: 'int' })
  cantidadMovi!: number;

  @Column({ name: 'stock_prod_anterior', type: 'int', nullable: true })
  stockProdAnterior?: number | null;

  @Column({ name: 'stock_prod_posterior', type: 'int', nullable: true })
  stockProdPosterior?: number | null;

  @Column({ name: 'stock_lote_anterior', type: 'int', nullable: true })
  stockLoteAnterior?: number | null;

  @Column({ name: 'stock_lote_posterior', type: 'int', nullable: true })
  stockLotePosterior?: number | null;

  @Column({
    name: 'observacion_movi',
    type: 'varchar',
    length: 250,
    nullable: true,
  })
  observacionMovi?: string | null;

  @Column({ name: 'usua_ingre', type: 'varchar', length: 25 })
  usuaIngre!: string;

  @Column({
    name: 'fecha_ingre',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaIngre!: Date;

  @ManyToOne(
    () => ProductoEntity,
    (producto) => producto.movimientosInventario,
    {
      onDelete: 'RESTRICT',
    },
  )
  @JoinColumn({ name: 'ide_prod' })
  producto?: ProductoEntity;

  @ManyToOne(() => LoteEntity, (lote) => lote.movimientosInventario, {
    nullable: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'ide_lote' })
  lote?: LoteEntity | null;

  @ManyToOne(() => DetalleEntregaEntity, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'ide_deta_entr' })
  detalleEntrega?: DetalleEntregaEntity | null;

  @ManyToOne(() => DetalleVentaEntity, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'ide_deta_vent' })
  detalleVenta?: DetalleVentaEntity | null;
}

export { MovimientoInventarioEntity as MovimientoInventario };
