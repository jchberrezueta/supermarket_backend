import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { DetallePedidoEntity } from './detalle_pedido.entity';

import { LoteEntity } from './lote.entity';

@Entity({
  name: 'detalle_pedido_lote_devolucion',
})
export class DetallePedidoLoteDevolucionEntity {
  @PrimaryGeneratedColumn({
    name: 'ide_deta_pedi_lote_devo',
  })
  ideDetaPediLoteDevo!: number;

  @Column({
    name: 'ide_deta_pedi',
    type: 'int',
  })
  ideDetaPedi!: number;

  @Column({
    name: 'ide_lote',
    type: 'int',
  })
  ideLote!: number;

  @Column({
    name: 'cantidad_devolucion',
    type: 'int',
  })
  cantidadDevolucion!: number;

  @Column({
    name: 'cantidad_procesada',
    type: 'int',
    default: 0,
  })
  cantidadProcesada!: number;

  @Column({
    name: 'usua_ingre',
    type: 'varchar',
    length: 25,
    default: 'system',
  })
  usuaIngre!: string;

  @Column({
    name: 'fecha_ingre',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaIngre!: Date;

  @Column({
    name: 'usua_actua',
    type: 'varchar',
    length: 25,
    nullable: true,
  })
  usuaActua?: string | null;

  @Column({
    name: 'fecha_actua',
    type: 'timestamp',
    nullable: true,
  })
  fechaActua?: Date | null;

  @ManyToOne(
    () => DetallePedidoEntity,

    (detallePedido) => detallePedido.lotesDevolucion,

    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'ide_deta_pedi',
  })
  detallePedido?: DetallePedidoEntity;

  @ManyToOne(
    () => LoteEntity,

    (lote) => lote.detallesPedidoDevolucion,

    {
      onDelete: 'RESTRICT',
    },
  )
  @JoinColumn({
    name: 'ide_lote',
  })
  lote?: LoteEntity;
}

export { DetallePedidoLoteDevolucionEntity as DetallePedidoLoteDevolucion };
