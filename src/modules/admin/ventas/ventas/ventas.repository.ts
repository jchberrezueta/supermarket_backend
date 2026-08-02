import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ClienteEntity,
  DetalleVentaEntity,
  EmpleadoEntity,
  LoteEntity,
  MetodoPagoClienteEntity,
  MovimientoInventarioEntity,
  ProductoEntity,
  VentaEntity,
} from '@entities';
import { EntityManager, Repository } from 'typeorm';
import { MoneyUtil } from '@common/utils/money.util';
import { CreateVentaCabeceraDTO } from './dto/create_venta_cabecera.dto';
import { CreateVentaDetalleDTO } from './dto/create_venta_detalle.dto';
import { FilterVentaDTO } from './dto/filter_venta.dto';
import { UpdateVentaCabeceraDTO } from './dto/update_venta_cabecera.dto';
import { UpdateVentaDetalleDTO } from './dto/update_venta_detalle.dto';

@Injectable()
export class VentasRepository {
  constructor(
    @InjectRepository(VentaEntity)
    private readonly ventaRepository: Repository<VentaEntity>,
    @InjectRepository(DetalleVentaEntity)
    private readonly detalleVentaRepository: Repository<DetalleVentaEntity>,
  ) {}

  async listar(manager?: EntityManager): Promise<VentaEntity[]> {
    return this.getVentaRepository(manager).find({
      order: {
        fechaVent: 'DESC',
        ideVent: 'DESC',
      },
    });
  }

  async buscarPorId(
    ideVent: number,
    manager?: EntityManager,
  ): Promise<VentaEntity | null> {
    return this.getVentaRepository(manager).findOne({
      where: {
        ideVent,
      },
    });
  }

  async buscarPorIdForUpdate(
    ideVent: number,
    manager: EntityManager,
  ): Promise<VentaEntity | null> {
    return manager
      .getRepository(VentaEntity)
      .createQueryBuilder('venta')
      .setLock('pessimistic_write')
      .where('venta.ideVent = :ideVent', { ideVent })
      .getOne();
  }

  async filtrar(
    filtros: FilterVentaDTO,
    manager?: EntityManager,
  ): Promise<VentaEntity[]> {
    const qb = this.getVentaRepository(manager)
      .createQueryBuilder('venta')
      .orderBy('venta.fechaVent', 'DESC')
      .addOrderBy('venta.ideVent', 'DESC');

    if (filtros.ideEmpl !== undefined && filtros.ideEmpl !== null) {
      qb.andWhere('venta.ideEmpl = :ideEmpl', {
        ideEmpl: filtros.ideEmpl,
      });
    }

    if (filtros.ideClie !== undefined && filtros.ideClie !== null) {
      qb.andWhere('venta.ideClie = :ideClie', {
        ideClie: filtros.ideClie,
      });
    }

    if (filtros.numFacturaVent) {
      qb.andWhere('LOWER(venta.numFacturaVent) LIKE LOWER(:numFacturaVent)', {
        numFacturaVent: `%${filtros.numFacturaVent}%`,
      });
    }

    if (filtros.estadoVent) {
      qb.andWhere('venta.estadoVent = :estadoVent', {
        estadoVent: filtros.estadoVent,
      });
    }

    if (filtros.fechaDesde) {
      qb.andWhere('venta.fechaVent >= CAST(:fechaDesde AS date)', {
        fechaDesde: filtros.fechaDesde,
      });
    }

    if (filtros.fechaHasta) {
      qb.andWhere(
        `
      venta.fechaVent <
      (
        CAST(:fechaHasta AS date) +
        INTERVAL '1 day'
      )
    `,
        {
          fechaHasta: filtros.fechaHasta,
        },
      );
    }
    return qb.getMany();
  }

  async listarDetallesPorVenta(
    ideVent: number,
    manager?: EntityManager,
  ): Promise<DetalleVentaEntity[]> {
    return this.getDetalleRepository(manager).find({
      where: {
        ideVent,
      },
      order: {
        ideDetaVent: 'ASC',
      },
    });
  }

  async buscarClientePorId(
    ideClie: number,
    manager: EntityManager,
  ): Promise<ClienteEntity | null> {
    return manager.getRepository(ClienteEntity).findOne({
      where: {
        ideClie,
      },
    });
  }

  async buscarEmpleadoActivoPorId(
    ideEmpl: number,
    manager: EntityManager,
  ): Promise<EmpleadoEntity | null> {
    return manager.getRepository(EmpleadoEntity).findOne({
      where: {
        ideEmpl,
        estadoEmpl: 'activo',
      },
    });
  }

  async buscarMetodoPagoActivoPorCliente(
    ideMetoPago: number,
    ideClie: number,
    manager: EntityManager,
  ): Promise<MetodoPagoClienteEntity | null> {
    return manager.getRepository(MetodoPagoClienteEntity).findOne({
      where: {
        ideMetoPago,
        ideClie,
        estado: 'activo',
      },
    });
  }

  async buscarProductoPorIdForUpdate(
    ideProd: number,
    manager: EntityManager,
  ): Promise<ProductoEntity | null> {
    return manager
      .getRepository(ProductoEntity)
      .createQueryBuilder('producto')
      .setLock('pessimistic_write')
      .where('producto.ideProd = :ideProd', { ideProd })
      .getOne();
  }

  async guardarProducto(
    producto: ProductoEntity,
    manager: EntityManager,
  ): Promise<ProductoEntity> {
    return manager.getRepository(ProductoEntity).save(producto);
  }

  async buscarLotePorIdForUpdate(
    ideLote: number,
    manager: EntityManager,
  ): Promise<LoteEntity | null> {
    return manager
      .getRepository(LoteEntity)
      .createQueryBuilder('lote')
      .setLock('pessimistic_write')
      .where('lote.ideLote = :ideLote', { ideLote })
      .getOne();
  }

  async listarMovimientosSalidaPorDetalleForUpdate(
    ideDetaVent: number,
    manager: EntityManager,
  ): Promise<MovimientoInventarioEntity[]> {
    return manager
      .getRepository(MovimientoInventarioEntity)
      .createQueryBuilder('movimiento')
      .setLock('pessimistic_write')
      .where('movimiento.ideDetaVent = :ideDetaVent', { ideDetaVent })
      .andWhere('movimiento.tipoMovi = :tipoMovi', {
        tipoMovi: 'salida_venta',
      })
      .orderBy('movimiento.ideMovi', 'ASC')
      .getMany();
  }

  async listarMovimientosPorVenta(
    ideVent: number,
    manager?: EntityManager,
  ): Promise<MovimientoInventarioEntity[]> {
    const repository = manager
      ? manager.getRepository(MovimientoInventarioEntity)
      : this.ventaRepository.manager.getRepository(MovimientoInventarioEntity);

    return repository
      .createQueryBuilder('movimiento')
      .innerJoin('movimiento.detalleVenta', 'detalle')
      .leftJoinAndSelect('movimiento.lote', 'lote')
      .where('detalle.ideVent = :ideVent', { ideVent })
      .orderBy('movimiento.ideMovi', 'ASC')
      .getMany();
  }

  async guardarLote(
    lote: LoteEntity,
    manager: EntityManager,
  ): Promise<LoteEntity> {
    return manager.getRepository(LoteEntity).save(lote);
  }

  async guardarMovimiento(
    movimiento: Partial<MovimientoInventarioEntity>,
    manager: EntityManager,
  ): Promise<MovimientoInventarioEntity> {
    const repository = manager.getRepository(MovimientoInventarioEntity);
    return repository.save(repository.create(movimiento));
  }

  async guardarVenta(
    venta: VentaEntity,
    manager: EntityManager,
  ): Promise<VentaEntity> {
    return manager.getRepository(VentaEntity).save(venta);
  }

  async crearVenta(
    cabecera: CreateVentaCabeceraDTO,
    totales: {
      cantidadVent: number;
      subTotalVent: number;
      totalVent: number;
    },
    manager: EntityManager,
  ): Promise<VentaEntity> {
    const repository = manager.getRepository(VentaEntity);

    const venta = repository.create({
      ideEmpl: cabecera.ideEmpl,
      ideClie: cabecera.ideClie,
      numFacturaVent: cabecera.numFacturaVent,
      fechaVent: new Date(cabecera.fechaVent),
      cantidadVent: totales.cantidadVent,
      subTotalVent: MoneyUtil.toMoneyString(totales.subTotalVent),
      totalVent: MoneyUtil.toMoneyString(totales.totalVent),
      dctoSocioVent: MoneyUtil.toMoneyString(cabecera.dctoSocioVent),
      dctoEdadVent: MoneyUtil.toMoneyString(cabecera.dctoEdadVent),
      estadoVent: cabecera.estadoVent as VentaEntity['estadoVent'],
      tipoPagoVent: (cabecera.tipoPagoVent ??
        'efectivo') as VentaEntity['tipoPagoVent'],
      ideMetoPago: cabecera.ideMetoPago ?? null,
      usuaIngre: 'admin',
    });

    return repository.save(venta);
  }

  async actualizarVenta(
    venta: VentaEntity,
    cabecera: UpdateVentaCabeceraDTO,
    totales: {
      cantidadVent: number;
      subTotalVent: number;
      totalVent: number;
    },
    manager: EntityManager,
  ): Promise<VentaEntity> {
    venta.ideEmpl = cabecera.ideEmpl;
    venta.ideClie = cabecera.ideClie;
    venta.numFacturaVent = cabecera.numFacturaVent;
    venta.fechaVent = new Date(cabecera.fechaVent);
    venta.cantidadVent = totales.cantidadVent;
    venta.subTotalVent = MoneyUtil.toMoneyString(totales.subTotalVent);
    venta.totalVent = MoneyUtil.toMoneyString(totales.totalVent);
    venta.dctoSocioVent = MoneyUtil.toMoneyString(cabecera.dctoSocioVent);
    venta.dctoEdadVent = MoneyUtil.toMoneyString(cabecera.dctoEdadVent);
    venta.estadoVent = cabecera.estadoVent as VentaEntity['estadoVent'];
    venta.tipoPagoVent = (cabecera.tipoPagoVent ??
      'efectivo') as VentaEntity['tipoPagoVent'];
    venta.ideMetoPago = cabecera.ideMetoPago ?? null;
    venta.usuaActua = 'admin';
    venta.fechaActua = new Date();

    return manager.getRepository(VentaEntity).save(venta);
  }

  async reemplazarDetalles(
    ideVent: number,
    detalles: Array<CreateVentaDetalleDTO | UpdateVentaDetalleDTO>,
    manager: EntityManager,
  ): Promise<DetalleVentaEntity[]> {
    const repository = manager.getRepository(DetalleVentaEntity);

    await repository.delete({
      ideVent,
    });

    const nuevosDetalles = detalles.map((detalle) =>
      repository.create({
        ideVent,
        ideProd: detalle.ideProd,
        cantidadProd: detalle.cantidadProd,
        precioUnitarioProd: MoneyUtil.toMoneyString(detalle.precioUnitarioProd),
        subtotalProd: MoneyUtil.toMoneyString(detalle.subtotalProd),
        dctoPromoProd: MoneyUtil.toMoneyString(detalle.dctoPromoProd),
        ivaProd: MoneyUtil.toMoneyString(detalle.ivaProd),
        totalProd: MoneyUtil.toMoneyString(detalle.totalProd),
      }),
    );

    return repository.save(nuevosDetalles);
  }

  async eliminarVentaConDetalles(
    ideVent: number,
    manager: EntityManager,
  ): Promise<number> {
    await manager.getRepository(DetalleVentaEntity).delete({
      ideVent,
    });

    const result = await manager.getRepository(VentaEntity).delete({
      ideVent,
    });

    return result.affected ?? 0;
  }

  private getVentaRepository(manager?: EntityManager): Repository<VentaEntity> {
    if (manager) {
      return manager.getRepository(VentaEntity);
    }

    return this.ventaRepository;
  }

  private getDetalleRepository(
    manager?: EntityManager,
  ): Repository<DetalleVentaEntity> {
    if (manager) {
      return manager.getRepository(DetalleVentaEntity);
    }

    return this.detalleVentaRepository;
  }
}
