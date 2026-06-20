import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DetalleVentaEntity, VentaEntity } from '@entities';
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
      qb.andWhere('venta.fechaVent >= :fechaDesde', {
        fechaDesde: filtros.fechaDesde,
      });
    }

    if (filtros.fechaHasta) {
      qb.andWhere('venta.fechaVent <= :fechaHasta', {
        fechaHasta: filtros.fechaHasta,
      });
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
      tipoPagoVent: cabecera.tipoPagoVent as VentaEntity['tipoPagoVent'],
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
